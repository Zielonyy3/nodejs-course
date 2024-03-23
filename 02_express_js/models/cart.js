const path = require("path");
const rootDir = require("../util/path");
const fs = require("fs");
const dataPath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice, callback) {
        fs.readFile(dataPath, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0,
            };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

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

}