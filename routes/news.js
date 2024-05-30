var express = require('express');
const axios = require('axios');
var router = express.Router();

// const API_KEY = 'e7a07253a0ff452ead1497f7ca267d52'; 
const API_KEY = 'a3a57c49760152eb5e48acf5527cc76c'; // weather api

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/search', (req, res) => {

  const city = req.body.city;

  if(!city) {
    console.log("enter name of the city")
    res.render('search');
  } else { 
    res.redirect('/api/news/' + city);
  }
})

//get one concrete new

//get all news
router.get('/news/:city', async (req, res) => {//id
    const {city} = req.params;
    console.log("city = " + city);
    if (!city) {
      city = "almaty";
      // return res.status(400).json({ error: 'City parameter is required' });
    }
  
    try {
        //q=${city}&from=2024-05-28
        // const response = await axios.get(`https://newsapi.org/v2/everything?&sortBy=publishedAt&domains=wsj.com&apiKey=${API_KEY}`);
        // const response = await axios.get(`https://newsapi.org/v2/everything?q=${city}&sortBy=publishedAt&apiKey=${API_KEY}`);
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = response.data;//не корректные данные
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;