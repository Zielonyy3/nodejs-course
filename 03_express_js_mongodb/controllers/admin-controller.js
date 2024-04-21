const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('admin/products', {
            path: '/admin/products',
            pageTitle: 'Admin products',
            prods: products
        });
    } catch (e) {
        console.warn(e);
    }
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        editing: false,
    });
}

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);

        if (!product) {
            return res.redirect('/404');
        }
        res.render('admin/edit-product', {
            product: product,
            path: '/admin/edit-product',
            pageTitle: 'Add product',
            editing: editMode,
        });
    } catch (e) {
        console.warn(e);
    }
}

exports.postEditProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = new Product({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            price: req.body.price,
            id: prodId,
        });

        await product.save();
        res.redirect(`/admin/edit-product/${product._id.toString()}?edit=true`);
    } catch (e) {
        console.warn(e);
    }
}

exports.postAddProduct = async (req, res, next) => {
    try {
        console.log(req.user);
        const product = new Product({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            price: req.body.price,
            userId: req.user._id,
        });
        const result = await product.save();
        res.redirect('/')
    } catch (e) {
        console.error(e)
    }
}

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const result = await Product.deleteById(prodId);
        res.redirect('/admin/products');
    } catch (e) {
        console.warn(e);
    }

}
