let ES = require('../es/ESClient');
let config = require('../config/dev.json');

module.exports = class EsModel {
    _commitData() {
        return new Promise(function(resolve, reject){
            ES.client.index({
                index: this.index,
                type: this.type,
                body : this.data
            }, function(err, res){
                if(err) reject(err);
                resolve(res);
            });
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

            promises.push(this._commitData());

            Promise.all(promises)
            .then(function(results){
                resolve(results);
            }, function(errors) {
                reject(errors);
            });

        }.bind(this));

    }
}