"use strict"

let EsModel = require('./EsModel');

module.exports = class Reservation extends ESModel {
    constructor(config, restaurant, data) {
        super(config, data);
        this.index = 'reservations';
        this.type = 'reservation';
        this.restaurant = restaurant;
    }
    isAvailable(day, slot, partySize, customer) {
        this.restaurant.getAvailability().atTime()
    }

}