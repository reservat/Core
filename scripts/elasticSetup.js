let config = require('../config/dev.json');
let ES = require('../es/ESClient')(config);

let indices = [{
        name : 'restaurants',
        type : 'restaurant',
        mapping : 'restaurant.json'
    },
    {
        name : 'reservations',
        type : 'reservation',
        mapping : 'reservation.json'
    },
    {
        name : 'users',
        type : 'user',
        mapping : 'user.json'
    }
];

let indexPromiseFn = function(index){
    return new Promise(function(resolve, reject){
        let mappings = {};
        mappings[index.type] = require(`../es/mappings/${index.mapping}`);

        ES.client.indices.create({
            index : index.name,
            body : {
                mappings : mappings
            }
        }, function(err, res){
            // TODO - try to update mapping
            if(err) resolve(false);
            console.log('added mapping ' + index.name);
            resolve(res);
        })
    });
}

let promises = [];

indices.forEach((index) => {
    promises.push(indexPromiseFn(index));
});

Promise.all(promises)
.then((response) => {
    console.log('DONE');
});