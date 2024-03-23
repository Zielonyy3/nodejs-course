const Cart = require("./cart");
const db = require('../util/database');

module.exports = class Product {
    constructor({id = null, title, imageUrl, description, price}) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute(`INSERT INTO products (title, imageUrl, description, price)
                           VALUES (?, ?, ?, ?)`,
            [this.title, this.imageUrl, this.description, this.price]
        );
    }

    static deleteById(id, callback) {

    }

    static find(id) {
        return db.execute('SELECT * FROM products where id = ? LIMIT 1', [id]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }
}