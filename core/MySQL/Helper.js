const mysql = require('mysql');

module.exports = {
    objectForUpdate(object, allowedFields) {
        let updateString = 'SET ';
        let updates = [];
        for(let field in object){
            if(allowedFields.includes(field)){
                updates.push(`${field} = ${mysql.escape(object[field])}`);
            }
        }
        return updateString += updates.join(', ');
    },
    objectForInsert(object, allowedFields) {
        let setFields = [];
        let values = [];
        for(let field in object){
            if(allowedFields.includes(field)){
                setFields.push(field);
                values.push(mysql.escape(object[field]));
            }
        }
        return `(${setFields.join(', ')}) VALUES(${values.join(', ')})`;
    }
}