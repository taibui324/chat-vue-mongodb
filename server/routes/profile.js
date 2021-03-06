const express = require('express');
const router = express.Router();

const passport = require('passport');

const { User } = require('../models/User');


router.get('/:handle', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = await User.findOne({ handle: req.params.handle })
        .select('-password -session_id')
        .exec();

    if (user) {
        return res
            .status(200)
            .json(user)
            .end();
    } else {
        return res
            .status(404)
            .json({ error: `No User Found called ${req.params.username}` })
            .end();
    }
});

module.exports = router;
