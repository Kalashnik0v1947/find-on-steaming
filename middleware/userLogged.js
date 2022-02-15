module.exports = (req, res, next) => {

    if (req.session?.user?.username) {
        next();
    } else {
        res.redirect('/login')
    }

}