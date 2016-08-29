// app/routes.js
var routes = require('../config/pollconfig.js');
var mypath;
module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


       app.get('/loginshared', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('loginShared.ejs');
    });

    app.post('/loginshared',/*function(req,res, next){
        var mypath =req.body.id;
        console.log(mypath);
        return next();
    },*/ passport.authenticate('local-login'),function(req, res){
        var p = req.body.id;
        console.log("printinf p"+p);
        res.redirect('polls#/poll/'+p);

    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/polls', isLoggedIn, function (req, res) {
        res.render('pollsview.ejs',{
            user: req.user // get the user out of session and pass to template
        });
    });
    
   

    app.get('/polls/polls',isLoggedIn, routes.list);
    app.get('/polls/:id', isLoggedIn, routes.poll);

       app.get('/shared/:id', function(req,res){
            var id = req.params.id;
            var signedIn = isLoggedInShared(req,res);
            if(signedIn){
                console.log("user is signed in ");
                routes.pollShared(id);
                res.redirect('/polls#/poll/'+id);

            }
           else{
               res.render('loginShared.ejs', {pollId : id});
           }
    });

    app.post('/polls',isLoggedIn, routes.create);

     app.get('/about', isLoggedIn, function (req, res) {
        res.render('about.ejs',{
            user: req.user // get the user out of session and pass to template
        });
    });
    
    app.get('/contact', isLoggedIn, function (req, res) {
        res.render('contact.ejs',{
            user: req.user // get the user out of session and pass to template
        });
    });
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInShared(req, res){
    if (req.isAuthenticated()){
        return true;
    }
    else{
        return false;
    }
}
