let moment = require('moment');
let TableOptions = require('./TableOptions');

module.exports = class Availability {
    constructor(restaurant){
        this.restaurant = restaurant;
        this.slots = {};
    }
    onDay(requiredSeats, day){
        let checks = [];

        checks.push(this.isOpen(day.format('dddd')));
        checks.push(this.getSlots(day))

        return Promise.all(checks);
    }
    isOpen(day) {
        return new Promise(function(resolve, reject){
            if(!this.restaurant.getOpeningTimes().on(day)){
                reject({
                    code : 'AV0001',
                    msg : 'This restaurant is closed'
                });
            } else {
                resolve({
                    isOpen: true
                });
            }

        }.bind(this));
    }
    getSlots(day) {
        return new Promise(function(resolve, reject){
            let openingTimes = this.restaurant.getOpeningTimes().on(day.format('dddd'));
            let {opens, closes} = openingTimes;
            let iterator = opens;
            let i = 0
            while(iterator.format('H:mm') != closes.format('H:mm') || iterator == 100){
                this.slots[iterator.format('H:mm')] = i++;
                iterator.add(this.restaurant.data.slotSpace, 's');
            }
            resolve();

        }.bind(this));
    }
    getTables(partySize) {
        let restaurantTables = this.restaurant.getTables().toJSON();
        let maxWastage = this.restaurant.getSettings('maxWastage');
        let options = new TableOptions(restaurantTables, partySize, maxWastage);
        return options.compute();
    }
}