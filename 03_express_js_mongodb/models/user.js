const MongoModel = require("./MongoModel");
const {ObjectId} = require("mongodb");
const Product = require("./product");
const {getDb} = require("../util/database");

class User extends MongoModel {
    static collectionName = 'users';

    constructor({username, email, cart, id = null}) {
        super(id)
        this.username = username;
        this.email = email;
        this.cart = cart;
    }

    async addToCart(product) {
        const cartProductIndex = this.cart?.items.findIndex(cp => cp.productId.toString() === product._id.toString());

        let newQuantity = 1;
        const updatedCartItems = this.cart ? [...this.cart.items] : [];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity,
            });
        }

        const updatedCart = {
            items: updatedCartItems,
        }

        return await this.getCollection()
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: updatedCart}}
            )
    }

    async getCart() {
        if (this.cart) {
            const productIds = this.cart.items.map(cp => cp.productId);
            const products = await getDb().collection('products').find({_id: {$in: productIds}}).toArray();
            return products.map(p => {
                const cartProduct = this.cart.items.find(i => i.productId.toString() === p._id.toString());
                return {
                    ...p,
                    quantity: cartProduct.quantity
                }
            });
        } else {
            return [];
        }
    }

    async removeFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());

        return await this.getCollection()
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: {items: updatedCartItems}}}
            )
    }

    async addOrder() {
        const products = await this.getCart();
        const order = {
            items: products,
            user: {
                _id: new ObjectId(this._id),
                username: this.username,
                email: this.email,
            }
        }
        await getDb().collection('orders').insertOne(order);
        this.cart = {items: []};

        return await this.getCollection()
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: null}}
            )
    }

    getOrders() {
        return getDb().collection('orders').find({'user._id': this._id}).toArray()
    }

}

module.exports = User;