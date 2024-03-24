const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

const seedUsers = () => {
    return User.findByPk(1)
        .then((user) => {
            if (!user) {
                return User.create({name: 'Simon', email: 'simon@mail.com'})
            }
            return Promise.resolve(user);
        })
}

const seedProducts = () => {
    return Product.findByPk(1)
        .then((product) => {
            if (!product) {
                return Product.create({
                    title: 'TV',
                    price: 1299.99,
                    imageUrl: 'https://picsum.photos/200/250',
                    description: 'The greatest tv available on the market',
                    userId: 1,
                })
            }
            return Promise.resolve(product);
        })
}

const seedCarts = () => {
    return User.findByPk(1)
        .then((user) => {
            return user.createCart();
        })
        // .then(cart => {
        //     Product.findByPk(1).then(product => {
        //         cart.addProduct(product, {through: {quantity: 2}})
        //     })
        // })
}

exports.seedDatabase = () => {
    const seeders = [
        seedUsers,
        seedProducts,
        seedCarts
    ]

    return seedUsers()
        .then(() => seedProducts())
        .then(() => seedCarts())
}
