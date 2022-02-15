const router = require("express").Router();
const User = require("../models/User.model");

// bcrypt and salt password hash
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// SignUp, add to database, and encrypt password
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.",
      });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hashSync(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword,
      });
    })
    .then((createdUser) => {
      console.log("new user was created woo!!", createdUser);
      res.render("user/user-profile");
      // session
      console.log(req.session);
      req.session.user = createdUser;
      console.log(req.session.user);
      
    })
    .catch((err) => console.log("ERROR CREATING USER", err));
    // .catch((error) => {
    //   if (error instanceof mongoose.Error.ValidationError) {
    //     res.status(500).render("auth/signup", { errorMessage: error.message });
    //   } else {
    //     next(error);
    //   }
    // });
});

// Login Route
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });
 
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => {
  res.render('user/user-profile', { userInSession: req.session.currentUser });
});


router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


module.exports = router;


// Password1