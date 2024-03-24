require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require("path");
const errorsController = require('./controllers/errors-controller');

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
    .sync({force: true})
    .then(result => User.findByPk(1))
    .then((user) => {
        if (!user) {
            return User.create({name: 'Simon', email: 'simon@mail.com'})
        }
        return Promise.resolve(user);
    })
    .then((user) => {
        app.listen(3000);
    })
    .catch(err => console.error(err));