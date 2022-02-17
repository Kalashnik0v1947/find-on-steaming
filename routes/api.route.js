const router = require("express").Router();
const User = require("../models/User.model");
const Tweet = require("../models/Tweet.model");
var axios = require("axios").default;
var giphy = require('giphy-api')();

//middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/logged");


router.get("/test", (req,res)=>{
   
    // giphy.search('pokemon').then(function (results) {
    //     console.log("api test", results.data)
        res.render("gif-test")
    // }).catch((err)=> {console.log("error", err)})
})


router.post("/test", (req,res)=>{
   
    giphy.search(req.body.search).then(function (results) {
        console.log("api test", results.data)
        res.render("create-tweet",{gifs: results.data})
    }).catch((err)=> {console.log("error", err)})
})



module.exports = router