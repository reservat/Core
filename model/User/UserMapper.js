"use strict"

const EsMapper = require('../EsMapper');

module.exports = class UserMapper extends EsMapper {
    constructor(config) {
        super(config);
        this.index = 'users';
        this.type = 'user';
        this.model = require('./User');
        this.config = config;
    }
}