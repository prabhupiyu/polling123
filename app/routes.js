// app/routes.js
var routes = require('../config/pollconfig.js');
var User = require('../app/models/user.js');

var mypath;
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
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
        successRedirect: '/polls#/dashboard', // redirect to the secure dashboard section
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
        res.redirect('polls#/vote/'+p);

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
        successRedirect: '/polls#/dashboard', // redirect to the secure profile section
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
                res.redirect('/polls#/vote/'+id);

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
    // PROFILE PICTURE =====================
    // =====================================

var path = require('path'),
    fs = require('fs');
var imgname;

// ...
app.post('/upload', upload.single('file'), function (req, res) {

  /*  res.send(req.file);*/
    var tempPath = req.file.path;
	imgname=tempPath.slice(8)+req.file.originalname;
    var targetPath = path.resolve('./uploads/'+imgname);


        console.log("hii in upload " +targetPath);
        console.log("hii in temp path " +tempPath);
        console.log("image name " +imgname);
        console.log("user name  "+req.body.email);


    if (path.extname(req.file.originalname).toLowerCase() === '.png' ||'.jpg'||'.jpeg'||'.gif')
	{

        fs.rename(tempPath, targetPath, function(err)
		{
            if (err) throw err;
			console.log("Upload completed!");
		});

			User.findOne({ 'local.email' :req.body.email }, function(err, user) {
				// if there are any errors, return the error

				if (err)
					return done(err);

            // check to see if theres already a user with that email
				if (user)
				{
				  console.log("user found "+user);
				  user.local.profpic=imgname;
                  user.save();
            } else {
                console.log("user with email id :" +req.body.email +" not found");
                if (err)
                return done(err);
            }


        });


    } else {
        console.log("File name :"+req.file.originalname);
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png files are allowed!");
        });
    }
      /* res.sendfile(path.resolve('./uploads/'+imgname));*/
    res.redirect('/profile')


});

     // =====================================
    // PROFILE SECTION  ENDS=====================
    //







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
