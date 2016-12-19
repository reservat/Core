"use strict";

let User = require('../core/User');
let Reservat = require('../index')(require('../config/dev.json'));
let moment = require('moment');
let chai = require('chai');
let faker = require('faker');

var expect = chai.expect;

describe("Handling users", function() {

    
    const user = new User({
        email : faker.internet.email()
    });

    const userMapper = Reservat.UserMapper();
    //const userRepo = Reservat.UserRepository();

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

    it("can be stored in our storage provider", function(done){
        userMapper.commit(user)
        .then((result) => {
            expect(user.getId()).to.not.be.undefined;
            done();
        })
    });

    /*
    it("can be found by e-mail address", function(done){
        userRepo.findByEmail(user.getEmail())
        .then((foundUser) => {
            expect(foundUser).to.not.be.false;
            expect(foundUser.getEmail()).to.equal(user.getEmail());
            done();
        });
    });
    
    it("can be found by a set of credentials", function(done){
        userRepo.findByCredentials(user.getEmail(), 'cake')
        .then((foundUser) => {
            done();
        });
    });
    */
    
    it("can be hard deleted from our storage provider", function(done){
        userMapper.delete(user)
        .then((result) => {
            expect(result).to.be.true;
            done();
        });
    });
    

});