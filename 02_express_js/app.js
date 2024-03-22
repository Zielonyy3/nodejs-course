const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin').routes;
const shopRoutes = require('./routes/shop');
const path = require("path");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page not found'
    });
})

app.listen(3000);

