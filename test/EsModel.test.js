"use strict"

let chai = require('chai');
let expect = chai.expect;

let Restaurant = require('../model/Restaurant');
let dummyData = require('./mockData/Paulos.json');

describe("An ElasticSearch Model class", function() {

  it("exposes a commit function on an extended class", function() {
      let Paulos = new Restaurant(dummyData);
      Paulos.commit();
  });

});