const path = require("path");
const rootDir = require('../util/path');
const fs = require("fs");

const dataPath = path.join(rootDir, 'data', 'products.json');

const getProducts = (callback) => {
    fs.readFile(dataPath, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor({title, imageUrl, description, price}) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProducts(products => {
            products.push(this);
            fs.writeFile(dataPath, JSON.stringify(products), err => {
                console.warn(err);
            })
        })
    }

    static find(id, callback) {
        getProducts(products => {
            const foundProduct = products.find(product => product.id === id);
            callback(foundProduct);
        })
    }

    static fetchAll(callback) {
        getProducts(callback);
    }
}