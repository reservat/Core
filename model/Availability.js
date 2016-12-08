let moment = require('moment');
let TableOptions = require('./TableOptions');
let dateHelper = require('../helpers/date');

module.exports = class Availability {
    constructor(restaurant){
        this.restaurant = restaurant;
        this.slots = {};
    }
    onDay(requiredSeats, day){
        return new Promise(function(resolve, reject){

            let checks = [];
            checks.push(this.isOpen(day.format('dddd')));
            checks.push(this.getSlots(day));
            checks.push(this.getTables(requiredSeats));

            Promise.all(checks)
            .then(function(result){

                let openStatus, timeSlots, tables;
                [openStatus, timeSlots, tables] = result;
                tables = tables.getDistinct();
                
                return this.createMatrix(timeSlots, tables);
            }.bind(this))
            .then(this.applyBookings)
            .then((completeMatrix) => {
                resolve(completeMatrix);
            })
            .catch(function(err){
                reject(err);
            });

        }.bind(this));
    }
    createMatrix(timeSlots, tables) {
        return new Promise(function(resolve, reject){
            let tableObj = {};
            tables.forEach((tblName) => {
                tableObj[tblName] = false;
            });
            for(let ts in timeSlots){
                timeSlots[ts] = tableObj;
            };
            resolve(timeSlots);
        });
    }
    applyBookings(timeSlots) {
        return new Promise(function(resolve, reject){
            resolve(timeSlots);
        });
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
    getSlots(day, pretty) {
        return new Promise(function(resolve, reject){
            let openingTimes = this.restaurant.getOpeningTimes().on(day.startOf('day').format('dddd'));
            let {opens, closes} = openingTimes;
            let iterator = opens;
            let i = 0
            while(iterator.format('H:mm') != closes.format('H:mm') || i == 100){
                let key = pretty ? iterator.format('H:mm') : dateHelper.secondsElapsed(iterator);
                this.slots[key] = i++;
                iterator.add(this.restaurant.data.slotSpace, 's');
            }
            resolve(this.slots);

        }.bind(this));
    }
    getTables(partySize) {
        let restaurantTables = this.restaurant.getTables().toJSON();
        let maxWastage = this.restaurant.getSettings('maxWastage');
        let options = new TableOptions(restaurantTables, partySize, maxWastage);
        return options.compute();
    }
}