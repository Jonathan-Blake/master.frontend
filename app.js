const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const session = require('express-session');
const {ExpressOIDC} = require('@okta/oidc-middleware');

const OktaAuth = require('@okta/okta-auth-js').OktaAuth;


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/portfolio');
const transactionsRouter = require('./routes/transaction');

const app = express();

const request = require('axios');

app.use(
    session({
      secret: 'W7eGy2_ds9bB2jyyJzfSdb6YZxk5uDSybKItD68f',
      resave: true,
      saveUninitialized: false,
    }),
);
const oidc = new ExpressOIDC({
  appBaseUrl: 'http://localhost:3000',
  // issuer: 'https://${yourOktaDomain}/oauth2/{authServerId}',
  issuer: 'https://dev-68268884.okta.com/oauth2/default',
  client_id: '0oazkp58oHxaUER455d6',
  client_secret: 'W7eGy2_ds9bB2jyyJzfSdb6YZxk5uDSybKItD68f',
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile',
});
// This auth client appears to have extended function from oidc that is
// needed to do the scope altering request the design requests for transactions
// however it will not launch with an error that it will not accept cookie as a
// storage option, even though its in the spec and was specifically removed.
//
// I think this is an error with running both okta configs at once however at
// this stage it is too late to remove oidc and rework it to use authclient.

// const authClient = new OktaAuth({
//   // Required config
//   issuer: 'https://dev-68268884.okta.com/oauth2/default',
//   clientSecret: 'W7eGy2_ds9bB2jyyJzfSdb6YZxk5uDSybKItD68f',
//   redirectUri: 'http://localhost:3000/authorization-code/callback',
//   clientId: '0oazkp58oHxaUER455d6',
//   storageManager: {
//     token: {
//       storageTypes: [
//         'localStorage',
//         'sessionStorage',
//       ],
//       useMultipleCookies: true, // puts each token in its own cookie
//     },
//     cache: {
//       storageTypes: [
//         'localStorage',
//         'sessionStorage',
//       ],
//     },
//     transaction: {
//       storageTypes: [
//         'sessionStorage',
//         'localStorage',
//       ],
//     },
//   },
// });

// ExpressOIDC attaches handlers for the /login and
// /authorization-code/callback routes.
app.use(oidc.router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

const env = nunjucks.configure(['views/'], {
  // set folders with templates
  autoescape: true,
  express: app,
});
env.addGlobal('parse', JSON.parse);
env.express(app);
// app.use(env)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(
    express.static(__dirname + '/public', {
      index: false,
      immutable: true,
      cacheControl: true,
      maxAge: '30d',
    }),
);
app.use(function(req, res, next) {
  if (req.userContext) {
    if (req.userContext.userinfo) {
      console.log('Logged in user');
      request.interceptors.request.use((request)=>{
        request.headers.Authorization = `Bearer ${req.userContext.tokens.access_token}`;
        console.log(JSON.stringify(req.userContext.tokens));
        return request;
      });
    } else {
      console.log('No user info');
    }
  } else {
    console.log('No user Context');
  }
  next();
});
app.use('/logout', oidc.forceLogoutAndRevoke(), (req, res) => {});

app.use('/', indexRouter);
app.use('/portfolio', oidc.ensureAuthenticated(), usersRouter);
app.use('/transaction', oidc.ensureAuthenticated(), /* Use of auth instead
of oidc is needed to authorise based on specific scopes */ transactionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.path +' not found');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
