let ES = require('../es/ESClient');
let config = require('../config/dev.json');

module.exports = class EsModel {
    getId() {
        return this._id;
    }
    _update() {
        return new Promise(function(resolve, reject){
            ES.client.update({
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
            ES.client.index({
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
            ES.client.delete({
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

            if(!ES.client) {
                throw new Error('ESClient is not available');
            }
            if(!this.index || !this.type){
                throw new Error('ESModels must have an index & type');
            }

            let promises = [];

            if(config.debug){
                promises.push(ES.logInfo(`${this.index}-commit`, this.data));
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