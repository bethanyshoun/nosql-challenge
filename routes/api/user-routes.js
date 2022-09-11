const router = require('express').Router();

//import functionality and hook up with the routes
const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/user-controller')

// /api/users

// GET all users and create new user
router
    .route('/')
    .get(getAllUser)
    .post(createUser);

// GET a single user by its _id and populated thought and friend data
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Add and Delete Friends
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);


// BONUS: Remove a user's associated thoughts when deleted.

// // example data
// {
//   "username": "lernantino",
//   "email": "lernantino@gmail.com"
// }
module.exports = router;