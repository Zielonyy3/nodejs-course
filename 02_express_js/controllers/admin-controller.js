const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then((products) => {
            res.render('admin/products', {
                path: '/admin/products',
                pageTitle: 'Admin products',
                prods: products
            });
        })
        .catch(err => console.warn(err));
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
    req.user.getProducts({where: {id: prodId}})
        .then(([product]) => {
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
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.update({
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                price: req.body.price,
                userId: req.user.id,
            })
        })
        .then(() => {
            res.redirect(`/admin/edit-product/${product.id}?edit=true`);
        })
        .catch(err => console.error(err));
}

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
        userId: req.user.id,
    })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.error(err));
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy()
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.warn(err))
}
