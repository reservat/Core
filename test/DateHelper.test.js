"use strict"

let DateHelper = require('../helpers/date');
let moment = require('moment');
let chai = require('chai');

let expect = chai.expect;

describe("A DateHelper helper class", function() {

  it("can convert a time of day into the seconds of that particular day", function() {
      let date = new moment('2016-12-03 10:39');
      let secondsElapsed = DateHelper.secondsElapsed(date);
      expect(secondsElapsed).to.equal(38340);
  });

  it("can create a moment from a day and hour and minute string", function(){
      let moment = DateHelper.momentFromDayAndHours('Saturday', '08:45');
      expect(moment.minutes()).to.equal(45);
  });

  it("can create a moment from a date stored in elasticsearch", function(){
      let moment = DateHelper.momentFromElastic(1, 37812);
      expect(moment.minutes()).to.equal(30);
  });

});