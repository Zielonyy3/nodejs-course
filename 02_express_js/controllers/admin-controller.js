const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            path: '/admin/products',
            pageTitle: 'Admin products',
            prods: products
        });
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        editing: false,
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.find(prodId).then(([product]) => {
        if (!product) {
            return res.redirect('/404');
        }
        res.render('admin/edit-product', {
            product: product,
            path: '/admin/edit-product',
            pageTitle: 'Add product',
            editing: editMode,
        });
    })

}

exports.postEditProduct = (req, res, next) => {
    const product = new Product({
        id: req.body.productId,
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    });
    product.save()
        .then((res) => {
            console.log('inserted', res);
            res.redirect(`/admin/edit-product/${product.id}?edit=true`);
        })
        .catch(err => console.warn(err));
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    });
    product.save()
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.warn(err));
}

exports.showProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products',
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId, () => {
        res.redirect('/admin/products');
    })
}
