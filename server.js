'use strict'

// Load Environment Variables from the .env file
require('dotenv').config();
//use application dependencies
const express = require('express');
const cors = require('cors');
// Application setup
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

//API Routes
server.get('/location', (request, response) => {
    try {
        const geoData = require('./data/geo.json');
        const city = request.query.city
        const cityData = new CityInfo(city, geoData)
        response.status(200).json(cityData);
    } catch (error) {
        errorHandler(error, request, response)
    }
});

server.get('/weather', (request, response) => {
    try {
        const weatherData = require('./data/darksky.json');

        weatherData.data.forEach(value => {
            let weatherDesc = value.weather.description;
            let date =  new Date(value.datetime).toDateString();
            new WeatherInfo(weatherDesc, date)
        });
        response.status(200).json(cityWeatherArrayOfObj);

    } catch (error) {
        errorHandler(error, request, response)
    }

});

server.use('*', notFoundHandler)


function CityInfo(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
};

let cityWeatherArrayOfObj = [];
// console.log('hey', cityWeatherArrayOfObj);
function WeatherInfo(weatherData, date) {
    this.forecast = weatherData;
    this.time = date;
    cityWeatherArrayOfObj.push(this);
};

function notFoundHandler(request, response){
    response.status(404).send({'status':404 , 'responseText':'Sorry, something went wrong'})
}

function errorHandler() {
    response.status(500).send(error);
}


// Make sure the server is listening to the upcoming request
server.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
})