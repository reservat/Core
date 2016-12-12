let tableHelper = require('../helpers/table');

module.exports = class TableOptions {
    constructor(tables, partySize, maxWastage) {
        this.partySize = partySize;
        this.tables = tables;
        this.maxWastage = maxWastage;
        this.buckets = {
            STRAIGHT : [],
            WITHWASTE : [],
            BOX : []
        }
    }
    getCounts() {
        return {
            STRAIGHT : this.buckets.STRAIGHT.length,
            WITHWASTE : this.buckets.WITHWASTE.length,
            BOX : this.buckets.BOX.length
        }
    }
    verify(tableOccupancy) {
        // This is a promise as we want to resolve FAST if we have availability
        return new Promise(function(resolve, reject){
            ['STRAIGHT', 'WITHWASTE', 'BOX'].forEach((bucket) => {
                this.buckets[bucket].forEach((tables) => {
                    if(!Array.isArray(tables)){
                        // for clarity - this is a single table
                        let table = tables;
                        // if the table has a false value it means it is available
                        if(!tableOccupancy[table.name]) resolve({
                            available : true,
                            type : bucket,
                            name : table.name
                        });
                    } else {
                        let allAvailable = tables.some((tbl) => {
                            return !tableOccupancy[tbl.name]
                        });
                        if(allAvailable) resolve({
                            available : true,
                            type : bucket,
                            names : tables.map((tbl) => {
                                return tbl.name
                            })
                        });
                    }
                });
            });
            resolve(false);
        }.bind(this));
    }
    getDistinct() {
        let tableNames = [];
        ['BOX', 'STRAIGHT', 'WITHWASTE'].forEach((bucket) => {
            this.buckets[bucket].forEach((tables) => {
                if(Array.isArray(tables)){
                    tables.forEach((tbl) => {
                        if(!tableNames.includes(tbl.name)){
                            tableNames.push(tbl.name);
                        }
                    });
                } else {
                    if(!tableNames.includes(tables.name)){
                        tableNames.push(tables.name);
                    }
                }
            });
        });

        return tableNames;
    }
    compute() {
        return new Promise(function(resolve, reject){
            Promise.all([
                tableHelper.findCombinations(this.tables, this.partySize, this.maxWastage),
                tableHelper.findStraight(this.tables, this.partySize),
                tableHelper.findWithWastage(this.tables, this.partySize, this.maxWastage)
            ])
            .then(function(result){
                [this.buckets.BOX, this.buckets.STRAIGHT, this.buckets.WITHWASTE] = result;
                resolve(this);
            }.bind(this));
        }.bind(this));
    }
    toDebugString() {

        let string = `Attempting to seat ${this.partySize} people\r\n`;

        ['BOX', 'STRAIGHT', 'WITHWASTE'].forEach(function(bucket){
            string += `Bucket ${bucket} has ${this.buckets[bucket].length} options\r\n`;
            this.buckets[bucket].forEach(function(tables){
                if(Array.isArray(tables)){
                    let names = [];
                    let seats = [];
                    tables.forEach((tbl) => {
                        names.push(tbl.name);
                        seats.push(tbl.seats);
                    });
                    let capacity = seats.reduce((a, b) => {
                        return a + b;
                    });
                    string += `A combination of tables ${names.join(', ')} which seat ${seats.join(', ')} totalling ${capacity}\r\n`;
                } else {
                    string += `Table ${tables.name} which seats ${tables.seats}\r\n`;
                }
            });

        }.bind(this));

        return string;
    }
    setState(state) {
        this.state = state;
    }
}