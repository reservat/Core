let Restaurant = require('./model/Restaurant');
let UserMapper = require('./core/User/Mapper');
let UserRepository = require('./core/User/Repo');

class ReservatCore {
    constructor(config) {
        this.Restaurant = function(data){
            return new Restaurant(config, data);
        }
        this.UserMapper = function() {
            return new UserMapper(config);
        }
        this.UserRepository = function() {
            return new UserRepository(config);
        }
    }
}


module.exports = (config) => {
    return new ReservatCore(config);
}