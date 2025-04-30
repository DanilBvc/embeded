const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/stats', (req, res) => {
  const stats = sessionController.getStats();
  res.json(stats);
});

module.exports = router;