"use strict"

let chai = require('chai');
let expect = chai.expect;

let Restaurant = require('../model/Restaurant');
let dummyData = require('./mockData/Paulos.json');
let moment = require('moment');

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

        Paulos.getAvailability().getSlots(moment())
        .then((slots) => {
            done();
        });

    });

    /*
    it("Should return tables that are applicable to the party size", function(done){

        Paulos.getAvailability().getApplicableTables(2)
        .then((tables) => {
            done();
        });

    });
    */

});