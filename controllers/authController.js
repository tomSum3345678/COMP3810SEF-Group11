// controllers/authController.js
const passport = require('passport');
const User = require('../models/User');

// Display login page
exports.showLoginPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Login',
    messages: req.session.messages || []
  });
  req.session.messages = [];
};

// Process local login
exports.processLogin = (req, res, next) => {
  // Check if form data exists
  if (!req.fields || !req.fields.email || !req.fields.password) {
    console.log('Missing credentials in request fields:', req.fields);
    req.session.messages = ['Please provide email and password'];
    return res.redirect('/login');
  }
  
  console.log('Login attempt with email:', req.fields.email);
  
  // Manually assign req.fields values to req.body so Passport can access them
  req.body = {
    email: req.fields.email,
    password: req.fields.password
  };

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      console.log('Authentication failed:', info.message);
      req.session.messages = [info.message || 'Invalid email address or password'];
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }

      console.log('User logged in successfully:', user.email);
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
};

// Handle Google login
exports.googleCallback = (req, res) => {
  const redirectTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

// Handle logout
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
};

// Check authentication status
exports.checkAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        userId: req.user.userId,
        email: req.user.email,
        displayName: req.user.displayName,
        role: req.user.role,
        picture: req.user.picture
      }
    });
  } else {
    res.json({
      authenticated: false
    });
  }
};
