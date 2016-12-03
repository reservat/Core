"use strict";

var Restaurant = require('../model/Restaurant');
var moment = require('moment');
var chai = require('chai');

var expect = chai.expect;

describe("A Restaurant Model", function() {

  let fatJohnnys = new Restaurant();

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

      fatJohnnys.setOpeningTimes(openingTimes)
      .then((restaurant) => {
          let monday = restaurant.getOpeningTimes().on('Monday');
          expect(monday.opens.format('H:mm')).to.equal('8:30');
      });

  });

  it("can update opening times", function(){

      let newOpeningTimes = [{
          day : 'Tuesday',
          opens : '10:30',
          closes : '18:30'
      }];

      fatJohnnys.setOpeningTimes(newOpeningTimes)
      .then((restaurant) => {
          let tuesday = restaurant.getOpeningTimes().on('Tuesday');
          expect(tuesday.opens.format('H:mm')).to.equal('10:30');
      })


  });

});