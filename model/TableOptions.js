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
    compute() {
        return new Promise(function(resolve, reject){
            Promise.all([
                tableHelper.findCombinations(this.tables, this.partySize, this.maxWastage),
                tableHelper.findStraight(this.tables, this.partySize),
                tableHelper.findWithWastage(this.tables, this.partySize, this.maxWastage)
            ])
            .then(function(result){
                this.buckets.BOX = result[0];
                this.buckets.STRAIGHT = result[1];
                this.buckets.WITHWASTE = result[2];
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