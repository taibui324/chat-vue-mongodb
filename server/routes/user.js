const express = require('express');
const router = express.Router();

const passport = require('passport');

const { User } = require('../models/User');

const { checkEditProfileFields } = require('../middleware/authenticate');


router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const users = await User.find({}, 'image email username location').exec();

    if (users) {
        return res
            .status(200)
            .json(users)
            .end();
    } else {
        return res.status(404).json({ error: 'No Users Found' });
    }
});

router.put(
    '/current',
    [passport.authenticate('jwt', { session: false }), checkEditProfileFields],
    async (req, res) => {
        const updateFields = {};

        for (let key of Object.keys(req.body)) {
            if (req.body[key] !== null) {
                updateFields[key] = req.body[key];
            }
        }

        User.findOneAndUpdate({ _id: req.user.id }, { $set: updateFields }, { new: true })
            .select('-password')
            .then(doc => res.json({ success: true, user: doc }))
            .catch(err => res.json({ error: err }));
    }
);

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});


router.delete('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ success: true });
});

module.exports = router;
