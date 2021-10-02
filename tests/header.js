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

describe('Header', ()=> {
  describe('Unauthenticated', ()=>{
    before(function() {
      app = require('../app');
    });
    it('Signup Button should appear', function() {
      chai.request(app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            const page = parse(res.text);
            expect(page.querySelector('#signupButton'))
                .should.exist;
            expect(page.querySelector('#logoutButton'))
                .not.to.exist;
          });
    });
    it('Portfolio Button should not appear', function() {
      chai.request(app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            const page = parse(res.text);
            expect(page.querySelector('#portfolioButton'))
                .not.to.exist;
          });
    });
  });
  describe('Authenticated', ()=>{
    before(function() {
      const oidcUtil = require('@okta/oidc-middleware/src/oidcUtil');
      sinon.stub(oidcUtil, 'ensureAuthenticated')
          .callsFake(function(req, res, next) {
            return next();
          });
      app = require('../app');
    });
    it('Signin Button should appear', function() {
      chai.request(app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            const page = parse(res.text);
            expect(page.querySelector('#signupButton'))
                .not.to.exist;
            expect(page.querySelector('#logoutButton'))
                .should.exist;
          });
    });
    it('Portfolio Button should appear', function() {
      chai.request(app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            const page = parse(res.text);
            expect(page.querySelector('#portfolioButton'))
                .should.exist;
          });
    });
  });
});
