const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    } catch (e) {
        console.warn(e);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;

        const product = await Product.findById(prodId);
        if (!product) {
            res.redirect('/404');
        }
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    } catch (e) {
        console.warn(e);
    }
};


exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    } catch (e) {
        console.warn(e)
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const products = await req.user.getCart();
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    } catch (e) {
        console.error(e)
    }
}

exports.postCart = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        const product = await Product.findById(prodId);
        const result = await req.user.addToCart(product);

        res.redirect('cart');
    } catch (e) {
        console.error(e)
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders();

        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        })
    } catch (e) {
        console.error(e);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.postDeleteItem = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        await req.user.removeFromCart(prodId)
        res.redirect('/cart');
    } catch (e) {
        console.error(e);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        await req.user.addOrder()
        res.redirect('/orders');
    } catch (e) {
        console.error(e);
    }

}