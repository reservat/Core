"use strict";

var Restaurant = require('../model/Restaurant');
var moment = require('moment');
var chai = require('chai');

var expect = chai.expect;

describe("A Restaurant Model", function() {

  it("can have opening times", function() {

      let openingTimes = [
          {
              day : 'Monday',
              opens : '8:30',
              closes : '21:00'
          },
          {
              day : 'Tuesday',
              opens: '9:30',
              closes : '22:00'
          }
      ];

      var FatJohnnys = new Restaurant();

      FatJohnnys.setOpeningTimes(openingTimes)
      .then((restaurant) => {
          expect(restaurant.data.openingTimes.length).to.equal(2);
      }, (err) => {
          
      });

  });

});