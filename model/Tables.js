"use strict"

let tableHelper = require('../helpers/table');

module.exports = class Tables
{
    constructor(tables) {
        this.data = tables;
    }
    toJSON() {
        return this.data;
    }
    largest() {
        let seats = this.data.map((table) => {
            return table.seats
        });
        return Math.max(...seats);
    }
    smallest() {
        let seats = this.data.map((table) => {
            return table.seats
        });
        return Math.min(...seats);
    }
    capacity() {
        return this.data.reduce((a, b) => {
            return a + b.seats;
        }, 0);
    }
    forParty(partySize) {
        return new Promise(function(resolve, reject){

            let promises = [tableHelper.findCombinations(this.data, partySize)];

            Promise.all(promises)
            .then((res) => {
                resolve({
                    tables : res[0]
                })
            });

        }.bind(this));
    }
}