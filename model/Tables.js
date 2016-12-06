"use strict"

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
    capacity() {
        return this.data.reduce((a, b) => {
            return a + b.seats;
        }, 0);
    }
}