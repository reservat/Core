let config = require('../config/dev.json');
let elasticsearch = require('elasticsearch');

class ESClient {
    constructor() {
        let esConfig = config.es;
        this.client = new elasticsearch.Client({
            host: `http://${esConfig.user}:${esConfig.password}@${esConfig.host}`
        });
    }
    logInfo(msgType, msgBody){
        return this.log('INFO', msgType, msgBody);
    }
    log(msgStatus, msgType, msgBody) {
        return new Promise(function(resolve, reject){
            this.client.index({
                index : 'app-logs',
                type : 'log',
                body : {
                    timestamp: Date.now(),
                    messageType : msgType,
                    messageStatus : msgStatus,
                    messageData : msgBody
                }
            }, function(err, response){
                if(err) reject(err);
                resolve(response);
            });
        }.bind(this));
    }
}

let instance = new ESClient();

module.exports = instance;