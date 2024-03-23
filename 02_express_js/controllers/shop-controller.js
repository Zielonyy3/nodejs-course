const Product = require('../models/product');
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products, metadata]) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.warn(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    if (prodId) {
        Product.find(prodId).then(([product]) => {
            if (!product) {
                res.redirect('/404');
            }

            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: product.title,
                path: '/products'
            });
        });
    } else {
        res.redirect('/404');
    }
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([products, metadata]) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.warn(err));
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.quantity
                    });
                }
            }

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        })
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.find(prodId).then(([product]) => {
        Cart.addProduct(product.id, product.price, cart => {
            res.redirect('cart');
        })
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.postDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.find(prodId).then(([product]) => {
        Cart.deleteProduct(prodId, product.price, () => {
            res.redirect('cart');
        })
    })
};
