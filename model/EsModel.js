module.exports = class EsModel {
    commit(){
        if(!this.index){
            throw new Error('ESModels must have an index');
        }
    }
}