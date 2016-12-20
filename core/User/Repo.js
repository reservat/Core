"use strict"
const MySQLRepository = require('../MySQL/Repo');

module.exports = class UserRepository extends MySQLRepository {
    constructor(config) {
        super(config);
        this.table = 'users';
        this.model = require('../User');
    }
    findByEmail(email) {
        return new Promise(function(resolve, reject){

            const escapedEmail = this.client.escape(email),
                query = `SELECT * FROM ${this.table} WHERE email = ${escapedEmail}`;

            this.client.query(query, function(err, rows, fields){
                const user = new this.model(rows[0]);
                resolve(user);
            }.bind(this));

        }.bind(this));
    }
    findByCredentials(email, password) {
        return new Promise(function(resolve, reject){
            let user;
            this.findByEmail(email)
            .then((foundUser) => {
                user = foundUser;
                return user.verifyPassword(password);
            })
            .then((verified) => {
                resolve(user);
            });

        }.bind(this));
    }
}