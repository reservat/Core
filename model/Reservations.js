"use strict";

let ESClient = require('../es/ESClient');
let moment = require('moment');

module.exports = class Reservations {
    constructor(config, restaurant) {
        this.restaurant = restaurant;
        this.ES = new ESClient(config);
    }
    onDay(day) {
        return new Promise(function(resolve, reject){
            let query = {
                "range" : {
                    "day" : {
                        "gte" : day.startOf('day').format('x'),
                        "lte" : day.endOf('day').format('x')
                    }
                }
            }
            this.ES.client.search({
                index : 'reservations',
                body : {
                    query : query
                }
            }, function(err, response){
                if(err) reject(err);
                if(response.hits){
                    resolve(response.hits.hits);
                } else {
                    resolve({});
                }
            });
        }.bind(this));
    }
}