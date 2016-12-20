"use strict"

module.exports = class MySQLEntity {
    constructor(data) {
        this.data = data;
        this.id = data.id ? data.id : undefined;
    }
    getId(id) {
        return this.id;
    }
}