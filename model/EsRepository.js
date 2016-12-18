module.exports = class EsRepository {
    constructor(config, data) {
        this.ES = require('../es/ESClient')(config);
        this.config = {
            debug : config.debug
        };
    }
    findById(id) {
        return new Promise(function(resolve, reject){
            this.ES.client.get({
                index: this.index,
                type: this.type,
                id: id
            }, function(err, res){
                if(err) reject(err);
                const model = new this.Model(res._source);
                model.id = res._id;
                resolve(model);
            }.bind(this))
        }.bind(this));
    }
}