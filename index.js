const Restaurant = require('./model/Restaurant');
const UserMapper = require('./core/User/Mapper');
const UserRepository = require('./core/User/Repo');
const MySQLClient = require('./core/MySQL/Client');

class ReservatCore {
    constructor(config) {

        const clients = {
            mysql : new MySQLClient(config)
        };

        this.Restaurant = function(data){
            return new Restaurant(config, data);
        }
        this.UserMapper = function() {
            return new UserMapper(clients);
        }
        this.UserRepository = function() {
            return new UserRepository(clients);
        }
    }
}

module.exports = (config) => {
    return new ReservatCore(config);
}