"use strict"
const EsRepository = require('../EsRepository');

module.exports = class UserRepository extends EsRepository {
    constructor(config) {
        super(config);
        this.index = 'users';
        this.type = 'user';
        this.model = require('./User');
    }
    findByEmail(email) {
        return new Promise(function(resolve, reject){
            this.ES.client.search({
                index: this.index,
                body:   {
                    "query" : {
                        "constant_score" : {
                            "filter" : {
                                "term" : {
                                    "email" : email
                                }
                            }
                        }
                    }
                }
            }, function(err, res){
                if(err) reject(err);
                if(res.hits.total){
                    const model = new this.model(res.hits.hits[0]._source);
                    model.id = res._id;
                    resolve(model);
                } else {
                    resolve(false);
                }
            }.bind(this))
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
            .then((verificationResult) => {
                console.dir(verificationResult);
                resolve(user);
            });
        }.bind(this));
    }
}