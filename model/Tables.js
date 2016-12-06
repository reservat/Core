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
    forParty(partySize) {
        if(partySize > this.largest()){
            // No alternatives, we will HAVE to box pack this request

            /* TODO BoxPack - We need to take the partysize and return an array of 
            arrays that contain multiple tables that are both .canMerge and can make up the number we have provided */

        } else {

        }
    }
}