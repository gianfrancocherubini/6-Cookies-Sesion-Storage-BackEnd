const express = require('express');
const routerCarrito = require('./routes/carrito.router');
const { router } = require('./routes/products.router');
const routerSessions =require ('./routes/session.router')
const {engine}=require('express-handlebars')
const path = require('path');
const mongoose =require(`mongoose`)
const sessions = require ('express-session')
const mongoStore = require ('connect-mongo')

const PORT = 3015;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions(
    {
        secret:"codercoder123",
        resave: true, saveUninitialized: true,
        store: mongoStore.create(
            {
                mongoUrl:'mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority',
                mongoOptions:{ dbName: 'ecommerce' },
                ttl:3600
            }
        )
    }
))
app.use('/home', router)
app.use('/api/carts', routerCarrito)
app.use('/api/sessions', routerSessions)

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' });
        console.log('DB online..!');
    } catch (error) {
        console.log(error.message);
    }
};

connectToDatabase();