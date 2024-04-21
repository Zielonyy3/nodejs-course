const MongoModel = require('./MongoModel')

class Product extends MongoModel {
    static collectionName = 'products';

    constructor({title, price, description, imageUrl, userId, id = null}) {
        super(id)
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }
}

module.exports = Product;