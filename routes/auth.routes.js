const router = require("express").Router();
const User = require("../models/User.model");
const Tweet = require("../models/Tweet.model");
var axios = require("axios").default;

//middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/logged");

// bcrypt and salt password hash
const bcryptjs = require("bcryptjs");
const saltRounds = 10;


// SignUp, add to database, and encrypt password
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
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
    res.status(500).render("auth/signup", {
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
      console.log("new user was created", createdUser);
      
      // session
      console.log(req.session);
      req.session.user = createdUser;
    
      console.log(req.session.user);
      res.redirect("/userProfile");
    })
    .catch((err) => console.log("ERROR CREATING USER", err));
});

// Login Route
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

// User Profile
router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInSession: req.session.currentUser });
});

// Update user profile
router.get("/userProfile/:id/edit", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      console.log(user);
      res.render("user/edit-profile", { userInSession: user });
    })
    .catch((error) => next(error));
});

router.post("/userProfile/:id/edit", (req, res) => {
  const updatedUser = req.body;
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, updatedUser)
    .then(() => {
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

// Delete User
router.post("/userProfile/:id/delete", (req, res)=> {
  const updatedUser = req.body;
  const userId = req.params.id;
   User.findByIdAndDelete(userId, updatedUser)
  .then(() => {
    req.session.destroy((err) => {
      if (err) next(err);
      res.status(204).redirect("/auth/signup");
    });
  })
  .catch((error) => next(error));
});


// Logout and destroy session
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});


//This pulls up the create tweet form
router.get("/create-tweet", (req, res, next) => {
  res.render("create-tweet");
});

//This saves a new tweet in the database
router.post("/create-tweet", (req, res, next) => {
  Tweet.create({
    content: req.body.content,
    gif: req.body.gif,
    // creatorId: req.session._id,
  })
    .then((newTweet) => {
      console.log("A new tweet was created", newTweet);
      res.redirect("/all-tweets");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//This pulls all tweets from a database
router.get("/all-tweets", (req, res) => {
  Tweet.find()
    .populate("creatorId")
    .then((allTweets) => {
      console.log("All tweets", allTweets);
      res.render("all-tweets", { tweets: allTweets });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});






module.exports = router;
