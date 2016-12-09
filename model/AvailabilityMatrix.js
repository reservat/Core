"use strict"

let dateHelper = require('../helpers/date');

module.exports = class AvailabilityMatrix {
    constructor(day, timeSlots, tableOptions){
        this.day = day;
        this.tableOptions = tableOptions;
        let tableObj = {};
        tableOptions.getDistinct().forEach((tblName) => {
            tableObj[tblName] = false;
        });
        for(let ts in timeSlots){
            timeSlots[ts] = tableObj;
        };
        this.matrix = timeSlots;
    }
    applyBookings() {
        return new Promise(function(resolve, reject){
            //TODO: Booking logic!
            resolve(this);
        }.bind(this));
    }
    availableSlots() {
        return new Promise(function(resolve, reject){
            let available = {};
            let promises = [];

            for(let ts in this.matrix){
                let friendlyTs = dateHelper.momentFromSeconds(ts).format('H:mm');
                let promise = new Promise(function(resolve, reject){
                    this.tableOptions.verify(this.matrix[ts]).then((state) => {
                        available[friendlyTs] = state;
                        resolve();
                    });
                }.bind(this));
                promises.push(promise);
            }

            Promise.all(promises)
            .then((res) => {
                resolve(available);
            });
        }.bind(this));
    }
}