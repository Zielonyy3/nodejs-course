require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require("path");
const errorsController = require('./controllers/errors-controller');
const {seedDatabase} = require("./util/seeders");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorsController.show404);
app.get('/404', errorsController.show404);

sequelize
    .sync({})
    .then(() => seedDatabase())
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.error(err));