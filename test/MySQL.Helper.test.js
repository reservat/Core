"use strict"

const MySQLHelper = require('../core/MySQL/Helper');
const chai = require('chai');

const expect = chai.expect;

describe("A MySQL Helper", function() {

  it("can create a secure update string from an object", function() {

      const allowedFields = ['name', 'email'];
      const user = {
          name : 'Paul',
          email : 'paul@rsrv.at'
      };

      const updateString = MySQLHelper.objectForUpdate(user, allowedFields);
      expect(updateString).to.equal('SET name = \'Paul\', email = \'paul@rsrv.at\'');

  });

  it("can create a secure insert string from an object", function(){
      const allowedFields = ['name', 'email'];
      const user = {
          name : 'Paulos',
          email : 'test@rsrv.at'
      };

      const insertString = MySQLHelper.objectForInsert(user, allowedFields);
      expect(insertString).to.equal('(name, email) VALUES(\'Paulos\', \'test@rsrv.at\')');

  });

});