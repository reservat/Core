let Restaurant = require('./model/Restaurant');

class ReservatCore {
    constructor(config) {
        this.Restaurant = function(data){
            return new Restaurant(config, data);
        }
    }
}


module.exports = (config) => {
    return new ReservatCore(config);
}