const request = require('request');

const forecast = (latlng, callback) => {
    // encodeURIComponent also converts special characters to their corresponding uri code
    const url = `http://api.weatherstack.com/current?access_key=1463f9f6f44d82e80b9a7cbc03f7281d&query=${latlng.latitude},${latlng.longitude}`;
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to weather services.", undefined);
        } else if (body.error) {
            callback("Unable to find weather forecast for the given location. Try another search.", undefined);
        } else {
            const weather_description = body.current.weather_descriptions[0] ? body.current.weather_descriptions[0] : "Not known";
            callback(undefined, {location: body.location.name, forecast: weather_description});
        }
    });
}

module.exports = forecast;