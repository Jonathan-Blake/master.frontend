// Import the dependencies for testing
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const chaiDom = require('chai-dom');
const sinon = require('sinon');
const {parse} = require('node-html-parser');

// Configure chai
chai.use(chaiDom);
chai.use(chaiHttp);
chai.should();

let app;

describe('Homepage', ()=> {
  before(function() {
    app = require('../app');
  });

  it('Homepage should be ready to load paged data', function() {
    chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          const page = parse(res.text);
          expect(page.querySelector('script[src="javascripts/renderStockController.js"]'))
              .should.exist;
          expect(page.querySelector('#stockPriceDisplay'))
              .should.exist;
        });
  });
});

describe('Stock Cards', ()=>{
  before(function() {
    const mockData = require('./mocks/StockPage');
    const request = require('axios');
    sinon.stub(request, 'get').resolves(
        mockData,
    );
    app = require('../app');
  });

  it('stock should render right', function() {
    chai.request(app)
        .get('/stockData?size=5&page=0')
        .end((err, res) => {
          res.should.have.status(200);
          const page = parse(res.text);
          const cards = page.querySelectorAll('#stockPriceCard');
          expect(page.querySelectorAll('#stockPriceCard'))
              .should.have.length(5);
          // cards.xs.forEach((card, i) => {
            // card.querySelector('#stockCardPrice').should.have.value(
            //     mockData['_embedded'].stockResponseList[i].price);
          // });
        });
  });
});
