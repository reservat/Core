"use strict"

let EsModel = require('./EsModel');
let moment = require('moment');
let shortId = require('shortid');

module.exports = class Reservation extends EsModel {
    constructor(config, restaurant, data) {
        super(config, data);
        this.index = 'reservations';
        this.type = 'reservation';
        this.data = {};
        this.restaurant = restaurant;
    }
    isAvailable(day, slot, partySize) {
        return new Promise(function(resolve, reject){
            this.restaurant.getAvailability().atTime(partySize, slot, day)
            .then((availabilityMatrix) => {
                return availabilityMatrix.availableSlots();
            })
            .then((slot) => {
                let state = Object.values(slot)[0].state;
                resolve(state);
            });
        }.bind(this));
    }
    getReservationId() {
        return this.data.reservationId;
    }
    findByReservationId(shortId) {
        return new Promise(function(resolve, reject){
            this.ES.client.search({
                index : this.index,
                body : {
                    "query" : {
                        "match" : {
                            "reservationId" : shortId
                        }
                    }
                }
            }, function(err, res){
                if(err) reject(err);
                if(res.hits){
                    this.data = res.hits.hits[0]._source;
                    resolve(this);
                } else {
                    resolve({});
                }
            }.bind(this));
        }.bind(this));
    }
    make(day, slot, partySize, customer) {
        return new Promise(function(resolve, reject){
            this.isAvailable(day, slot, partySize).then(function(table){
                if(!table.available){
                    reject({
                        code : 'R0001',
                        msg : 'This time slot is not available'
                    });
                } else {
                    this.data = {
                        day : day.format('x'),
                        slot : slot,
                        customer : customer,
                        table : table.name ? table.name : table.names,
                        reservationId : shortId.generate(),
                        restaurantId : this.restaurant.getId(),
                        accepted : table.type == 'STRAIGHT' ? true : false,
                        allocationType : table.type,
                        created : moment().format('x'),
                        state : table.type == 'STRAIGHT' ? 'CONFIRMED' : 'PENDING'
                    }
                    this.commit().then((savedRecord) => {
                        resolve(this);
                    })
                }
            }.bind(this));
        }.bind(this));
    }

}