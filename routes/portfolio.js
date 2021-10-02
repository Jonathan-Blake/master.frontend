const express = require('express');
const router = express.Router();
const request = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('portfolio/portfolioMain', {title: 'Express',
    userContext: req.userContext});
});
router.get('/portfolioData', function(req, res, next) {
  console.log('Preparing Request');
  const params = {};
  if (req.query.size) {
    params['size'] = req.query.size;
  }
  if (req.query.page) {
    params['page'] = req.query.page;
  }
  headers = {
    Authorization: req.userContext ?
    `Bearer ${req.userContext.tokens.access_token}`:'',
  };
  console.log('About to request Data');
  request.get('http://localhost:8081/trader/portfolio', {params: params, headers: headers})
      .then((stockPage) => {
        console.log('Successful request '+ stockPage);
        res.locals.JSON = JSON;
        res.render('portfolio/portfolioComponent', {page: stockPage.data});
      })
      .catch((err) => {
        console.log('Error Retrieving Portfolio data '+ err);
        res.render( 'error');
      });
});

module.exports = router;
