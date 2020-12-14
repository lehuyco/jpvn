const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieSession = require('cookie-session')
const flash = require('connect-flash');
const i18n = require("i18n");

const routes = require('./routes');
const assets = require('connect-assets');
const graph = require('fbgraph');
const compression = require('compression')
const csrf = require('csurf')

const app = express();

const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('./models/User')

i18n.configure({
  locales:['vi', 'en'],
  directory: __dirname + '/locales',
  register: global
});
i18n.setLocale('vi');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.disable('x-powered-by');
app.use(logger('dev'));

app.use(compression())

app.use(express.static(path.join(__dirname, 'public')));
app.use(assets({
  paths: [
    'assets/css',
    'assets/js',
    'assets/img'
  ],
  gzip: true,
  buildDir: 'public/assets'
}));

// var csrfProtection = csrf({ cookie: true })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['d60e308455a642c59a5b8aba848e1dc4', 'db748087f753339a8ca0a9d61609c677'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// app.use(csrf({ cookie: true }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id.toString());
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'email', 'name', 'displayName', 'gender', 'profileUrl']
  },
  async (accessToken, refreshToken, profile, done) => {
    var data = profile._json
    try {
      var user = await User.findOneOrCreate({ email: data.email })
      if (!user.name) {
        user.name = data.name
        await user.save()
      }
      done(null, user)
    } catch (err) {
      done(err, null);
    }
  }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CONSUMER_KEY,
    clientSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  async (token, tokenSecret, profile, done) => {
    var data = profile._json
    try {
      var user = await User.findOneOrCreate({ email: data.email })
      if (!user.name) {
        user.name = data.name
        await user.save()
      }
      done(null, user)
    } catch (err) {
      done(err, null);
    }
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (username, password, done) => {
    console.log(username)
    try {
      let user = await User.findOne({ email: username });
      console.log(user)
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
