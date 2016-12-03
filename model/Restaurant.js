"use strict";

let moment = require('moment');
let dateHelper = require('../helpers/date');
let OpeningTimes = require('./OpeningTimes');

module.exports = class Restaurant {
    constructor(data) {
        this.data = data ? data : {
            openingTimes : []
        };

    }
    getOpeningTimes() {
        return new OpeningTimes(this.data.openingTimes);
    }
    setOpeningTimes(days) {
        return new Promise(function(resolve, reject){
            let dayPromises = [];

            days.forEach(function(day){
                dayPromises.push(this.setOpeningTimeForDay(day.day, day.opens, day.closes));
            }.bind(this));

            Promise.all(dayPromises).then(function(results){
                resolve(results.pop());
            }.bind(this), function(err){
                reject(err);
            }.bind(this));

        }.bind(this));
        
    }
    setOpeningTimeForDay(day, opens, closes) {
        return new Promise(function(resolve, reject){
            
            let openTime = dateHelper.momentFromDayAndHours(day, opens);
            let closeTime = dateHelper.momentFromDayAndHours(day, closes);

            let opensSeconds = dateHelper.secondsElapsed(openTime);
            let closesSeconds = dateHelper.secondsElapsed(closeTime);
            let dayNo = openTime.day();
            let changed = false;

            this.data.openingTimes.forEach(function(otDay){
                if(otDay.dayNo == dayNo) {
                    otDay.openingTime = opensSeconds;
                    otDay.closingTime = closesSeconds;
                    changed = true;
                }
            });
            
            if(!changed){
                this.data.openingTimes.push({
                    dayNo : dayNo,
                    openingTime : opensSeconds,
                    closingTime : closesSeconds
                });
            }
            resolve(this);

        }.bind(this));
    }
}