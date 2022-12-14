const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { userController } = require('../factory');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post((req, res) => userController.register(req, res));

router.get('/me', authMiddleware, (req, res) => res.status(StatusCodes.OK).json(req.user));
router.get('/search', (req, res) => userController.getByRole(req, res));

module.exports = router;
