"use strict";

let moment = require('moment');
let dateHelper = require('../helpers/date');
let EsModel = require('./EsModel');
let OpeningTimes = require('./OpeningTimes');
let Tables = require('./Tables');
let Availability = require('./Availability');

module.exports = class Restaurant extends EsModel {
    constructor(data) {
        // Defaults
        super(data);
        this.index = 'restaurants';
        this.type = 'restaurant';
        this.data = Object.assign({}, {
            openingTimes : [],
            slotSpace : 15 * 60,
            bookingAllocatedTimes : 60 * 60,
            tables : [],
            maxWastage : 2
        }, data);
    }
    getSettings(setting) {
        let settings = {
            'maxWastage' : this.data.maxWastage
        };
        if(setting && settings[setting]){
            return settings[setting];
        } else {
            return settings;
        }
    }
    getOpeningTimes() {
        return new OpeningTimes(this.data.openingTimes);
    }
    getTables() {
        return new Tables(this.data.tables);
    }
    getAvailability() {
        if(!this._id){
            throw new Error('Cannot check availability without a restaurant');
        }
        return new Availability(this);
    }
    setName(name) {
        this.data.name = name;
    }
    getName() {
        return this.data.name;
    }
    setTables(tables) {
        return new Promise(function(resolve, reject){
            let tablePromises = [];

            tables.forEach(function(table){
                tablePromises.push(this.setTable(table));
            }.bind(this))

            Promise.all(tablePromises).then(function(results){
                resolve(results.pop());
            }.bind(this));

        }.bind(this));
    }
    setTable(table) {
        return new Promise(function(resolve, reject){
            let changed = false;
            this.data.tables.forEach(function(savedTable, i){
                if(savedTable.name == table.name){
                    this.data.tables[i] = table;
                    changed = true;
                }
            }.bind(this));

            if(!changed){
                this.data.tables.push(table);
            }

            resolve(this);
        }.bind(this));
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