const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const MONGODB_URI = 'mongodb+srv://andrey:1Zfjcfc1SSpD8pUC@cluster0.d4st5.mongodb.net/shop'
const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',  // папка default layout 
    extname: 'hbs', 
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine) 
app.set('view engine', 'hbs') // должно совпадать с app.engine
app.set('views', 'views')  // Если изменится, нужно поменять папку views

app.use(express.static(path.join(__dirname, 'public')))  // добовляем статическую папку public (будт по умолчанию подключать все из папки)
app.use(express.urlencoded({extended: true}))  // method post для страницы "добавить курс"
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/courses',coursesRoutes)
app.use('/add',addRoutes)
app.use('/card',cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/auth',authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true
        });
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
}

start()



