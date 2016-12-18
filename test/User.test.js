"use strict";

let User = require('../model/user/User');
let Reservat = require('../index')(require('../config/dev.json'));
let moment = require('moment');
let chai = require('chai');

var expect = chai.expect;

describe("Handling users", function() {

    const user = new User({
        email : 'paul@rsrv.at'
    });

    const userMapper = Reservat.UserMapper();

    it("can have a hashed password", function(done){
        const userPassword = 'cake';

        user.setPassword(userPassword)
        .then((user) => {
            expect(user.getPassword()).to.not.equal(userPassword);
            done();
        });

    });

    it("can have its hashed password verified", function(done){
        user.verifyPassword('cake').then((verified) => {
            expect(verified).to.be.true;
            done();
        });
    });

});