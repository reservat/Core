"use strict";

let Tables = require('../model/Tables');
let moment = require('moment');
let chai = require('chai');
let dummyData = require('./mockData/Paulos.json');

var expect = chai.expect;

describe("A Restaurants Table Model", function() {

  let tables = new Tables(dummyData.tables);

  it("can return the full capacity of its tables", function(){
      expect(tables.capacity()).to.equal(8);
  });

  it("can return the largest table available", function(){
      expect(tables.largest()).to.equal(4);
  });

});