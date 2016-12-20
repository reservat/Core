"use strict"

const MySQLMapper = require('../MySQL/Mapper');

module.exports = class UserMapper extends MySQLMapper {
    constructor(config) {
        super(config);
        this.table = 'users';
        this.model = require('../User');
        this.fields = {
            create : ['email', 'password'],
            update : ['email']
        }
    }
}