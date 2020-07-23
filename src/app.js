const path = require('path')//core node module
const express = require('express'); //npm module
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const hbs = require('hbs')

// console.log(__dirname); //path to directory current script lives in
// console.log(path.join(__dirname, '../public')); //path to file itself, .. goes up a folder

const app = express(); //creates express app
const port = process.env.PORT || 3000 //heroku port

//Define paths for express config--------------------------------------
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') //to change where express looks for templates
const partialsPath = path.join(__dirname, '../templates/partials')
// const helpPagePath = path.join(__dirname, '../public/help.html')
// const aboutPagePath = path.join(__dirname, '../public/about.html')

//Setup handlebars engine and views location-----------------------------
app.set('view engine', 'hbs')
app.set('views', viewsPath) //pointing express to custom directory
hbs.registerPartials(partialsPath)

//Setup static directory to server----------------------------------------
app.use(express.static(publicDirectoryPath))
// app.use(express.static(helpPagePath))
// app.use(express.static(aboutPagePath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Dan Tran'
    }) //allow us to render one of our handlebar templates - views folder in the root of project - second argument is objct that we want view to be able to access
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide a valid address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send( {error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })

            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query);
    res.send({
        products: []
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Dan Tran'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Dan Tran',
        helpText: 'This is some helpful text'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Dan Tran',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => { //must be last app.get call
    res.render('404', {
        title: '404',
        name: 'Dan Tran',
        errorMessage: 'Page not found'
    })
})


// //tell express app exactly what it should do
// app.get('', (req, res) => { //req = object containing info about incoming request to server, res contains methods which allow us to customize what we sending back
//     res.send('<h1>Weather</h1>') //allows us to send something back to requester
// })

// app.get('/help', (req, res) => {
//     res.send({
//         name: 'andrew',
//         age: 27
//     })
// })

// app.get('/about', (req, res) => {
//     res.send('About Page')
// })

app.get('/weather', (req, res) => {
    res.send({
        forecast: '85 degrees',
        location: 'Seattle'
    })
})

//app.com
//app.com/help
//app.com/about

app.listen(port, () => {
    console.log('server started on ' + port);
}) //starts up server