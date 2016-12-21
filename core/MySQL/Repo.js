"use strict";

module.exports = class MySQLRepository {
    constructor(clients) {
        this.client = clients.mysql.get();
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