const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=66d9d7f37fa6f845b216ec58ace03d0b&query=' + latitude + ',' + longitude + '&units=f'

    request( { url, json: true}, (error, { body } ) => { //paramters are options object and callback function, shorthand syntax for url, destructured for response.body
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
            console.log(body.error);
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees out.')
        }
    })
}



module.exports = forecast;