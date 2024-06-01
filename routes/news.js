var express = require('express');
const axios = require('axios');
var router = express.Router();

const API_KEY = 'e7a07253a0ff452ead1497f7ca267d52'; //news api

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//search
router.post('/search', (req, res) => {
  const keyword = req.body.keyword;
  if(!keyword) {
    console.log("enter keyword")
    res.render('search');
  } else { 
    res.redirect('/api/news/' + keyword);
  }
})

//get all news
router.get('/news/:keyword', async (req, res) => {//id
    const {keyword} = req.params;
    console.log("keyword = " + keyword);
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword parameter is required' });
    }
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
      const data = response.data;
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;