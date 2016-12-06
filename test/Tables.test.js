"use strict";

let Tables = require('../model/Tables');
let moment = require('moment');
let chai = require('chai');
let dummyData = require('./mockData/Paulos.json');

var expect = chai.expect;

describe("A Restaurants Table Model", function() {

  let tables = new Tables(dummyData.tables);

  it("can return the full capacity of its tables", function(){
      expect(tables.capacity()).to.equal(28);
  });

  it("can return the largest table available", function(){
      expect(tables.largest()).to.equal(6);
  });

  it("can provide options for guest sizes over the maximum table size (Box packing)", function(done){

      let partyCount = 11;

      tables.forParty(partyCount)
      .then((tableOptions) => {
          tableOptions.tables.forEach((tableGroup) => {
              let tableSeats = tableGroup.reduce((prev, tbl) => {
                  return prev + tbl.seats;
              }, 0);
              expect(tableSeats).to.equal(partyCount);
          });
          done();
      });

  });

});