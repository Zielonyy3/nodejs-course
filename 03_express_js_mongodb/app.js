require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const {run} = require('./util/database');
const app = express();
const {seedDatabase} = require("./util/seeders");
const User = require("./models/user");

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path = require("path");
const errorsController = require('./controllers/errors-controller');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(async (req, res, next) => {
    const users = await User.fetchAll();
    const user = users[0];
    if (users.length) req.user = new User({
        id: user._id.toString(),
        cart: user.cart,
        email: user.email,
        username: user.username,
    });
    console.log(req.user);
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.show404);
app.get('/404', errorsController.show404);

run(async () => {
    await seedDatabase();
    app.listen(3000);
})
