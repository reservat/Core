module.exports = class TableSelection {
    constructor() {
        this.buckets = {
            STRAIGHT : {},
            WITHWASTE : {},
            BOX : {}
        }
    }
    setState(state) {
        this.state = state;
    }
}