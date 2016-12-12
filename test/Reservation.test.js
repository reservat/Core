"use strict";

var Restaurant = require('../model/Restaurant');
var DateHelper = require('../helpers/date');
var moment = require('moment');
var chai = require('chai');
var config = require('../config/dev.json');

var expect = chai.expect;

describe("A Reservation Model", function() {

    let restaurant;

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
            tel : 07545458438 
        }).then((res) => {
            done();
        });
    });

});