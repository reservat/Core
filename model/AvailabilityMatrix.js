"use strict"

let dateHelper = require('../helpers/date');

module.exports = class AvailabilityMatrix {
    constructor(day, timeSlots, tableOptions, resSettings){
        this.day = day;
        this.restaurantSettings = resSettings;
        this.tableOptions = tableOptions;
        let tableObj = {};
        tableOptions.getDistinct().forEach((tblName) => {
            tableObj[tblName] = false;
        });
        for(let ts in timeSlots){
            timeSlots[ts] = Object.assign({}, tableObj);
        };
        this.matrix = timeSlots;
    }
    blockout(tbl, start, bookingId) {
        let end = start + this.restaurantSettings.bookingAllocatedTimes;
        let pnt = start;
        console.log(pnt)
        while(pnt != end){
            if(this.matrix[pnt]){
                this.matrix[pnt][tbl] = bookingId;
            }
            pnt = pnt + this.restaurantSettings.slotSpace;
        }
    }
    applyBookings(Reservations) {

        return new Promise(function(resolve, reject){
            Reservations.onDay(this.day)
            .then(function(reservations){
                reservations.forEach(function(res){
                    if(this.matrix[res._source.slot]){
                        if(Array.isArray(res._source.table)){
                            res._source.table.forEach(function(tbl){
                                this.blockout(tbl, res._source.slot, res._source.reservationId);
                            }.bind(this));
                        } else {
                            this.blockout(res._source.table, res._source.slot, res._source.reservationId);
                        }
                    }
                }.bind(this));
                resolve(this);
            }.bind(this));
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
                        available[friendlyTs] = { state : state, bookingToken : ts };
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