const path = require("path");
const rootDir = require('../util/path');
const fs = require("fs");
const Cart = require("./cart");

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
    constructor({id = null, title, imageUrl, description, price}) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProducts(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                products[existingProductIndex] = this;
            } else {
                this.id = Math.random().toString();
                products.push(this);
            }

            fs.writeFile(dataPath, JSON.stringify(products), err => {
                console.warn(err);
            })
        })

    }

    static deleteById(id, callback) {
        getProducts(products => {
            const product = products.find(product => product.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);

            const updateCartCallback = () => {
                Cart.deleteProduct(id, product.price, callback)
            }

            if(!updatedProducts.length) {
                fs.unlink(dataPath, updateCartCallback)
            }else {
                fs.writeFile(dataPath, JSON.stringify(updatedProducts), updateCartCallback)
            }
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