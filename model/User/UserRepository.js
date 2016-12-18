"use strict"
const EsRepository = require('../EsRepository');

module.exports = class UserRepository extends EsRepository {
    constructor() {
        super(config);
        this.index = 'users';
        this.type = 'user';
        this.model = require('./User');
    }
}