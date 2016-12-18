let Restaurant = require('./model/Restaurant');
let UserMapper = require('./model/user/UserMapper');
let UserRepository = require('./model/user/UserRepository');

class ReservatCore {
    constructor(config) {
        this.Restaurant = function(data){
            return new Restaurant(config, data);
        }
        this.UserMapper = function() {
            return new UserMapper(config);
        }
        this.UserRepository = function() {
            return new UserRepository();
        }
    }
}


module.exports = (config) => {
    return new ReservatCore(config);
}