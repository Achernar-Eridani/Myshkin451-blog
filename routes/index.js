// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "Myshkin451 Blog API is working!" });
});

module.exports = router;