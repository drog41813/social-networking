const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

router.use('/posts', thoughtRoutes);
router.use('/tags', userRoutes);

module.exports = router;
