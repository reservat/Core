"use strict"
const EsEntity = require('../EsEntity');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = class User extends EsEntity {
    setEmail(email) {
        this.data.email = email;
    }
    getEmail() {
        return this.data.email;
    }
    setPassword(passwordString) {
        return new Promise(function(resolve, reject){
            bcrypt.hash(passwordString, saltRounds)
            .then((hashed) => {
                this.data.password = hashed;
                resolve(this);
            });
        }.bind(this));
    }
    getPassword() {
        return this.data.password;
    }
    verifyPassword(passwordString) {
        return bcrypt.compare(passwordString, this.data.password);
    }
    toJson() {
        return {
            email : this.data.email,
            password : this.data.password
        }
    }
}