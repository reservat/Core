"use strict"

let chai = require('chai');
let expect = chai.expect;

let Restaurant = require('../model/Restaurant');
let dummyData = require('./mockData/Paulos.json');

describe("An ElasticSearch Model class", function() {

  it("exposes a commit function on an extended class", function(done) {
      
      let Paulos = new Restaurant();
      Paulos.setName(`Paulo's Bar and Grill`);

      let promises = [
          Paulos.setOpeningTimes(dummyData.openingTimes),
          Paulos.setTables(dummyData.tables),
          Paulos.commit()
      ];

      Promise.all(promises).then((res) => {
        expect(res.length).to.equal(3);
        done();
      }, function(errs){
        console.dir(errs);
      });
      
  });

});