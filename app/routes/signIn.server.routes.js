const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const authController = require('../controllers/auth.controller')(db);

  router.post('/signup', authController.signUp);
  router.post('/signin', authController.signIn);
  router.post('/forgot-password', authController.forgotPassword);

  return router;
};