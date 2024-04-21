const MongoModel = require('./MongoModel')

class Order extends MongoModel {
    static collectionName = 'orders';

    constructor({items, id = null}) {
        super(id)
        this.items = items
    }
}

module.exports = Order;