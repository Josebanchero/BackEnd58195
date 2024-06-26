

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;
