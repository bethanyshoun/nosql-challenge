//this file imports all of the API routes to prefix their endpoint names 
//and package them
const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

//add prefixes to routes created in thought and user routes files
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;