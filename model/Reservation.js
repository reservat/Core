"use strict"

let EsModel = require('./EsModel');

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
    make(day, slot, partySize, customer) {
        return new Promise(function(resolve, reject){
            this.isAvailable(day, slot, partySize).then(function(status){
                if(!status){
                    reject({
                        code : 'R0001',
                        msg : 'This time slot is not available'
                    });
                } else {
                    this.data = {
                        day : day.format('x'),
                        slot : slot,
                        customer : customer
                    }
                    resolve(this);
                }
            }.bind(this));
        }.bind(this));
    }

}