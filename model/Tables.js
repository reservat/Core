"use strict"

module.exports = class Tables
{
    constructor(tables) {
        this.data = tables;
    }
    toJSON() {
        return this.data;
    }
    capacity() {
        return this.data.reduce((a, b) => {
            return a + b.seats;
        }, 0);
    }
}