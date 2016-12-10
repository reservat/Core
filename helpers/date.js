"use strict"
var moment = require('moment');

module.exports.secondsElapsed = function(timeOfDay) {
    let seconds = 0;
    seconds += timeOfDay.seconds();
    seconds += (timeOfDay.minute() * 60);
    seconds += (timeOfDay.hour() * 60 * 60);   
    return seconds;
}

module.exports.momentFromDayAndHours = function(day, hoursAndMinutes) {
    const [hours, mins] = hoursAndMinutes.split(':');
    return new moment().day(day).startOf('day').hour(hours).minute(mins);
}

module.exports.momentFromElastic = function(day, seconds) {
    return new moment().day(day).startOf('day').second(seconds);
}

module.exports.momentFromSeconds = function(seconds) {
    return new moment().startOf('day').second(seconds);
}

module.exports.isoDayFuture = function(day){
    let next = moment().isoWeekday(day).startOf('day');
    while(next < moment()){
        next.add(1, 'Week');
    }
    return next;
}