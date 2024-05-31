var express = require('express');
const axios = require('axios');
var router = express.Router();

const API_KEY = 'e7a07253a0ff452ead1497f7ca267d52'; //news api
// const API_KEY = 'a3a57c49760152eb5e48acf5527cc76c'; // weather api

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/search', (req, res) => {

  const keyword = req.body.keyword;

  if(!keyword) {
    console.log("enter keyword")
    res.render('search');
  } else { 
    res.redirect('/api/news/' + keyword);
  }
})

//get one concrete new

//get all news
router.get('/news/:keyword', async (req, res) => {//id
    const {keyword} = req.params;
    console.log("keyword = " + keyword);
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword parameter is required' });
    }
  
    try {
        //q=${keyword}&from=2024-05-28
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
        // const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = response.data;
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;