"use strict"

let chai = require('chai');
let expect = chai.expect;

let Restaurant = require('../model/Restaurant');
let dummyData = require('./mockData/Paulos.json');
let moment = require('moment');
let dateHelper = require('../helpers/date');

describe("A Restaurant availability class", function() {

    let Paulos = new Restaurant();

    it("Should be available on an instantiated restaurant class", function(done){

        Paulos.setName(`Paulo's Bar and Grill`);

        let promises = [
            Paulos.setOpeningTimes(dummyData.openingTimes),
            Paulos.setTables(dummyData.tables)
        ];

        Paulos._id = 'TestID';

        Promise.all(promises).then((res) => {
            expect(res.length).to.equal(2);
            expect(Paulos.getAvailability.bind(Paulos)).to.not.throw(Error);
            done();
        }, function(errs){
            console.dir(errs);
        });

    });

    it("Should return a reservation error if the restaurant is not open on the selected day", function(done){
        
        Paulos.getAvailability().isOpen('Thursday')
        .catch((err) => {
            expect(err.code).to.equal('AV0001');
            done();
        });

    });

    it("Should return an object map of the time slots available in a given day", function(done){

        Paulos.getAvailability().getSlots(moment().isoWeekday('Tuesday'))
        .then((slots) => {
            done();
        });

    });

    it("Should return tables that are applicable to the party size", function(done){

        Promise.all([
            Paulos.getAvailability().getTables(2),
            Paulos.getAvailability().getTables(12),
            Paulos.getAvailability().getTables(3)
        ]).then((results) => {
            expect(results[0].getCounts().STRAIGHT).to.equal(3)

            expect(results[1].getCounts().STRAIGHT).to.equal(0)
            expect(results[1].getCounts().BOX).to.equal(3);

            expect(results[2].getCounts().WITHWASTE).to.equal(3);

            done();
        }).catch((err) => {
            console.dir(err);
        })

    });

    it("Should combine both the time slots and tables into a matrix", function(done){

        Paulos.getAvailability().onDay(6, dateHelper.isoDayFuture("Tuesday"))
        .then((availabilityMatrix) => {
            return availabilityMatrix.availableSlots();
        })
        .then((slots) => {
            console.log(slots);
            done();
        });
    });

});