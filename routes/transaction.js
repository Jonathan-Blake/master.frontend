const express = require('express');
const router = express.Router();
const request = require('axios');
const {body, validationResult} = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('transaction/transactionMain', {
    userContext: req.userContext,
    stockCode: req.query.stock,
  });
});

router.post('/', function(req, res, next) {
  body('number', 'number must be a positive integer').isInt({min: 1}),
  body('stock_code', 'Stock code must be present').trim().isString()
      .not().isEmpty();
  body('transaction_type', 'Transaction Type must be present');
  console.log(req.body);
  const errors = validationResult(req);
  // headers = {
  //   Authorization: req.userContext ?
  //   `Bearer ${req.userContext.tokens.access_token}` : '',
  // };
  if (!errors.isEmpty()) {
    res.redirect('/transaction?stock='+req.body.stockCode);
    // There are errors. Render form again with sanitized values/errors messages.
    // Error messages can be returned in an array using `errors.array()`.
  } else {
    // Data from form is valid.
    request.post('http://localhost:8081/transaction', {transactionType: req.body.transactionType, quantity: req.body.quantity, stockCode: req.body.stockCode});
    res.render('stockPrice/stockPriceMain', {
      userContext: req.userContext,
      stockCode: req.query.stock,
    });
  };
});

module.exports = router;
