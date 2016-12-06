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
        return new Promise(function(resolve, reject){

            if(partySize > this.largest()){
                // No alternatives, we will HAVE to box pack this request

                let availableTables = this.data.filter((tbl) => {
                    return tbl.canMerge;
                });
                
                let result = [];

                let pack = function(previous, tables) {
                    tables.forEach((tbl, i) => {

                        let prevTables = Array.from(previous);
                        prevTables.push(tbl);

                        let capacity = prevTables.reduce((prevCount, table) => {
                            return prevCount + table.seats;
                        }, 0);

                        if(capacity == partySize) {
                            result.push(prevTables);
                        }

                        pack(prevTables, tables.slice(i + 1));

                    });
                }
                
                pack([], availableTables);

                resolve({
                    tables : result
                });

            } else {

            }

        }.bind(this));
    }
}