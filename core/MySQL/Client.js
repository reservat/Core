"use strict"

const mysql = require('mysql');

module.exports = class MySQLClient {
    constructor(config) {
        this.config = config.mysql;
        this.instance = false;
    }
    get() {
        if(!this.instance) {
            return this.set();
        } else {
            return this.instance;
        }
    }
    set() {
        this.instance = mysql.createConnection(this.config);
        return this.instance;
    }
}