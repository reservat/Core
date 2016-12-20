"use strict";

const mysql = require('mysql');
const helper = require('./Helper');

module.exports = class MySQLMapper {
    constructor(config) {
        this.client = mysql.createConnection(config.mysql);
    }
    update(entity) {
        return new Promise(function(resolve, reject){

            if(!entity.getId()){
                throw new Error('You cannot update without an ID.');
            }

            const updateVars = helper.objectForUpdate(entity.toJson(), this.fields.update),
                escapedId = this.client.escape(entity.getId()),
                query = `UPDATE ${this.table} ${updateVars} WHERE id = ${escapedId};`;
            
            this.client.query(query, function(err, rows, fields){
                console.log(rows, fields);
                resolve(rows);
            });

        }.bind(this));
    }
    create(entity) {
        return new Promise(function(resolve, reject){

            const insertVars = helper.objectForInsert(entity.toJson(), this.fields.create),
                query = `INSERT INTO ${this.table} ${insertVars};`;
            
            this.client.query(query, function(err, rows, fields){
                entity.id = rows.insertId
                resolve(entity);
            });

        }.bind(this));
    }
    delete(entity) {
        return new Promise(function(resolve, reject){

            if(!entity.getId()){
                throw new Error('Cannot delete entity without an ID!');
            }

            const escapedId = this.client.escape(entity.getId()),
            deleteQuery = `DELETE from ${this.table} WHERE ID = ${escapedId}`;

            this.client.query(deleteQuery, function(err, rows, fields){
                resolve(true);
            });

        }.bind(this));
    }
    commit(entity) {
        if(!this.table && !this.fields){
            throw new Error('Instances of MySQL Mapper must have both allowed fields and tablename');
        }
        if(!entity.getId()){
            return this.create(entity);
        } else {
            return this.update(entity);
        }
    }
}