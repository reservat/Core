module.exports = class EsModel {
    constructor(config, data) {
        this.ES = require('../es/ESClient')(config);
        this.config = config;
    }
    getId() {
        return this._id;
    }
    _update() {
        return new Promise(function(resolve, reject){
            this.ES.client.update({
                index: this.index,
                type: this.type,
                id: this._id,
                body: {
                    doc : this.data
                }
            }, function(err, res){
                if(err) reject(err);
                resolve(res);
            }.bind(this))
        }.bind(this));
    }
    _create() {
        return new Promise(function(resolve, reject){
            this.ES.client.index({
                index: this.index,
                type: this.type,
                body : this.data
            }, function(err, res){
                if(err) reject(err);
                this._id = res._id;
                resolve(res);
            }.bind(this));
        }.bind(this));
    }
    delete() {
        return new Promise(function(resolve, reject){
            this.ES.client.delete({
                index: this.index,
                type: this.type,
                id: this._id
            }, function(err, res){
                if(err) reject(err);
                delete this._id;
                // ermmm... what do we do now?
                resolve(res);
            }.bind(this))
        }.bind(this));
    }
    commit() {

        return new Promise(function(resolve, reject){

            if(!this.ES.client) {
                throw new Error('ESClient is not available');
            }
            if(!this.index || !this.type){
                throw new Error('ESModels must have an index & type');
            }

            let promises = [];

            if(this.config.debug){
                promises.push(this.ES.logInfo(`${this.index}-commit`, this.data));
            }

            if(!this._id){
                promises.push(this._create());
            } else {
                promises.push(this._update());
            }

            Promise.all(promises)
            .then(function(results){
                resolve(results);
            }, function(errors) {
                reject(errors);
            });

        }.bind(this));

    }
}