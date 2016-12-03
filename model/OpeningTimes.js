"use strict"
var DateHelper = require('../helpers/date');
var moment = require('moment');

module.exports = class OpeningTimes
{
    constructor(times) {
        this.data = times;
        this.byDays = {};
        this.data.forEach(function(day){
            this.byDays[day.dayNo] = {
                opens : DateHelper.momentFromElastic(day.dayNo, day.openingTime),
                closes : DateHelper.momentFromElastic(day.dayNo, day.closingTime)
            }
        }.bind(this));
    }
    toString() {

    }
    on(dayName) {
        let dayNo = moment().isoWeekday(dayName).day();
        return this.byDays[dayNo];
    }
    toJSON() {
        return this.byDays;
    }
}