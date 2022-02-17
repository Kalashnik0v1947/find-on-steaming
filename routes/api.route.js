const router = require("express").Router();
const User = require("../models/User.model");
const Tweet = require("../models/Tweet.model");
var axios = require("axios").default;

//middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/logged");