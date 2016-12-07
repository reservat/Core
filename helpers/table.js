"use strict";

module.exports.findCombinations = function(tables, partySize, maxWastage) {

    return new Promise(function(resolve, reject){

        let availableTables = tables.filter((tbl) => {
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

                if((capacity >= partySize && capacity <= (partySize + maxWastage)) && prevTables.length > 1) {
                    result.push(prevTables);
                }

                pack(prevTables, tables.slice(i + 1));

            });
        }
        
        pack([], availableTables);

        resolve(result);

    });
}

module.exports.findStraight = function(tables, partySize) {
    return new Promise(function(resolve, reject){
        let availableTables = tables.filter((tbl) => {
            return tbl.seats == partySize;
        });
        resolve(availableTables);
    });
}

module.exports.findWithWastage = function(tables, partySize, allowedWastage) {
    return new Promise(function(resolve, reject){
        let availableTables = tables.filter((tbl) => {
            return (tbl.seats <= (partySize + allowedWastage) && tbl.seats > partySize);
        });
        resolve(availableTables);
    });
}