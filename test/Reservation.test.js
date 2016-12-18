"use strict";

var Restaurant = require('../model/Restaurant');
var DateHelper = require('../helpers/date');
var moment = require('moment');
var chai = require('chai');
var config = require('../config/dev.json');

var expect = chai.expect;

describe("A Reservation Model", function() {

    let restaurant;
    let reservation;

    before(function(done){
        new Restaurant(config).findById('AVjy-WUJDK4-VA88dvDq').then((res) => {
            restaurant = res;
            done();
        });
    });

    it("Should allow me to make a booking", function(done){
        let reservations = restaurant.Reservation();
        reservations.make(DateHelper.isoDayFuture('Tuesday'), 35100, 4, {
            name : 'Paul Westerdale',
            telephone : '07545458438'
        }).then((res) => {
            reservation = res;
            expect(reservation.getId()).to.not.be.undefined;
            done();
        });
    });

    it("Should be able to retrieve by a short Id", function(done){
        let resTest = restaurant.Reservation();
        resTest.findByReservationId("rymZfR67g")
        .then((resFound) => {
            expect(resFound.getId()).to.equal('AVj5wDt_DK4-VA88e4UY');
            done();
        });
    });
    
    it("should allow me to delete a booking", function(done){
        reservation.delete()
        .then((res) => {
            expect(reservation.getId()).to.be.undefined;
            done();
        });
    });
    

});