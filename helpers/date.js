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
    return new moment().day(day).hour(hours).minute(mins);
}

module.exports.momentFromElastic = function(day, seconds) {
    return new moment().day(day).hours(0).minutes(0).second(0).second(seconds);
}