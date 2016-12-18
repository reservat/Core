module.exports = class EsMapper {
    constructor(config, data) {
        this.ES = require('../es/ESClient')(config);
        this.config = {
            debug : config.debug
        };
    }
    _update(entity) {
        return new Promise(function(resolve, reject){
            this.ES.client.update({
                index: this.index,
                type: this.type,
                id: entity.getId(),
                body: {
                    doc : entity.toJson()
                }
            }, function(err, res){
                if(err) reject(err);
                resolve(res);
            }.bind(this))
        }.bind(this));
    }
    _create(entity) {
        return new Promise(function(resolve, reject){
            this.ES.client.index({
                index: this.index,
                type: this.type,
                body : entity.toJson()
            }, function(err, res){
                if(err) reject(err);
                entity.id = res._id;
                resolve(entity);
            }.bind(this));
        }.bind(this));
    }
    delete(entity) {
        return new Promise(function(resolve, reject){
            this.ES.client.delete({
                index: this.index,
                type: this.type,
                id: entity.getId()
            }, function(err, res){
                if(err) reject(err);
                delete this._id;
                // ermmm... what do we do now?
                resolve(true);
            }.bind(this))
        }.bind(this));
    }
    commit(entity) {

        return new Promise(function(resolve, reject){

            if(!this.ES.client) {
                throw new Error('ESClient is not available');
            }
            if(!this.index || !this.type){
                throw new Error('ESModels must have an index & type');
            }

            let promises = [];

            if(this.config.debug){
                promises.push(this.ES.logInfo(`${this.index}-commit`, entity));
            }

            if(!entity.getId()){
                promises.push(this._create(entity));
            } else {
                promises.push(this._update(entity));
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