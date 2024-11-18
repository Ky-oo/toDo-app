const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

router.post('/signup', async (req, res) => {
  const { email, password, display_name } = req.body;
  if (!email || !password || !display_name) {
    res.status(400);
    res.json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.build({ email: email, password: password, display_name });

  try {
    await user.validate({ fields: ['email'] });
  } catch (error) {
    res.status(500);
    res.json({ message: error});
    return;
  }

  try {
    await user.save();
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: "unexpected error" });
    return;
  }

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(404);
    res.json({ message: 'Email or password incorrect' });
    return;
  }

  const passwordOk = await bcrypt.compare(password, user.password);

  if(!passwordOk) {
    res.status(404);
    res.json({ message: 'Email or password incorrect' });
    return;
  }

  try {
    const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(500).json({ message: "Error generating token" });
  }
});

router.get('/verify_token', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, payload) => {
    if (err) {
      res.status(401);
      if(err.name === 'TokenExpiredError') {
        res.json({ message: 'Token expired' });
      } else {
        res.json({ message: 'Token invalid' });
      }
      return;

    } else {
      res.send("welcome user number " + payload.id);  
    }

  });
});





module.exports = router;