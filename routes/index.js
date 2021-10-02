const express = require('express');
const router = express.Router();
const request = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  const pageRequest = {
    page: req.query.page ? req.query.page : 0,
    size: req.query.size ? req.query.size :20,
  };
  res.render('stockPrice/stockPriceMain', {
    title: 'Express',
    pageRequestParams: pageRequest,
    userContext: req.userContext});
});


router.get('/stockData', function(req, res, next) {
  const params = {};
  if (req.query.size) {
    params['size'] = req.query.size;
  }
  if (req.query.page) {
    params['page'] = req.query.page;
  }
  request.get('http://localhost:8081/stock', {params: params})
      .then((stockPage) => {
        console.log("Data Retrieved");
        res.locals.JSON = JSON;
        res.render('stockPrice/stockPriceComponent', {
          page: stockPage.data,
          userContext: req.userContext});
      })
      .catch((err) => {
        console.log('Error Retrieving rendered stock component data '+ err);
        res.render( 'error');
      });
});

router.get('/stockData/:stockId', function(req, res, next) {
  request.get('http://localhost:8081/stock/'+req.params.stockId)
      .then((stockPage) => {
        res.locals.JSON = JSON;
        res.render('stockPrice/stockPriceComponent', {page: stockPage.data,
          userContext: req.userContext});
      })
      .catch(() => {
        console.log('Error Retrieving rendered stock data '+ err);
        res.render( 'error');
      });
});

router.get('/info/stockData/:stockId', function(req, res, next) {
  const params = {};
  if (req.query.size) {
    params['size'] = req.query.size;
  }
  if (req.query.page) {
    params['page'] = req.query.page;
  }
  // headers = {
  //   Authorization: req.userContext ? `Bearer ${req.userContext.tokens.access_token}` : '',
  // };
  request.get('http://localhost:8081/stock/'+req.params.stockId, {params: params})
      .then((stockInfo) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(stockInfo.data));
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          console.log('Error Response');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error Request');
          // console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
          console.log('Error message');
          // console.log('Error', error.message);
        }
      });
});
module.exports = router;
