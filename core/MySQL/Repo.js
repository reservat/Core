"use strict";

const mysql = require('mysql');

module.exports = class MySQLRepository {
    constructor(config) {
        this.client = mysql.createConnection(config.mysql);
    }
    findById(id) {
        return new Promise(function(resolve, reject){
            const escapedId = this.client.escape(id),
                query = `SELECT * FROM ${this.table} WHERE id = ${escapedId}`;

            this.client.query(query, function(err, rows, fields){
                console.log(err, rows, fields);
                resolve(rows);
            }.bind(this));

        }.bind(this));
    }
}