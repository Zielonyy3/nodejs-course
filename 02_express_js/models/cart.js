const path = require("path");
const rootDir = require("../util/path");
const fs = require("fs");
const {quiet} = require("nodemon/lib/utils");
const dataPath = path.join(rootDir, 'data', 'cart.json');

const getCart = (callback) => {
    fs.readFile(dataPath, (err, fileContent) => {
        let cart = {
            products: [],
            totalPrice: 0,
        };
        if (!err) {
            cart = JSON.parse(fileContent);
        }
        callback(cart);
    });
}

module.exports = class Cart {

    static addProduct(id, productPrice, callback) {
        getCart(cart => {
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProductIndex >= 0) {
                updatedProduct = {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1,
                }
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id: id,
                    quantity: 1,
                }
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += parseFloat(productPrice);
            fs.writeFile(dataPath, JSON.stringify(cart), err => {
                console.warn(err);
                callback(cart);
            })
        })
    }

    static deleteProduct(id, productPrice, callback) {
        getCart(cart => {
            if (!cart.products.length) {
                callback(cart);
            }

            const updatedCart = {...cart};
            const productIndex = cart.products.findIndex(prod => prod.id === id);
            if (productIndex >= 0) {
                const product = cart.products[productIndex]

                updatedCart.totalPrice -= productPrice * product.quantity;
                updatedCart.products = cart.products.filter(prod => prod.id !== id);

                fs.writeFile(dataPath, JSON.stringify(updatedCart), err => {
                    console.warn(err);
                    callback(cart);
                })
            } else {
                callback(cart);
            }
        });
    }

    static getCart(callback) {
        getCart(callback);
    }
}