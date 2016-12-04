let ES = require('../es/ESClient');

let indices = [{
    name : 'restaurants',
    type : 'restaurant',
    mapping : 'restaurant.json'
}];

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
            if(err) throw new Error(err);
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
    console.log(`${response.length} indices created`);    
},(errors) => {
    console.log(`${errors.length} errors occured`);
});