const { User, Thought } = require('../models');

//create a userController object with two methods for adding/removing comments
const userController = {
    // get all thoughts function 
    getAllUser(req, res) {
      User.find({})
      // .populate({
      //   path: 'users',
      //   select: '-__v'
      // })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one by id
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .populate({
          path: 'friends',
          select: '-__v'
        })
        .then(dbUserData => {
          // If no thought is found, send 404
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //create User
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    //update User by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    //???
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // ** TRY THESE**
    //Delete user and users associated thoughts
    deleteUser({ params }, res) {
      Thought.deleteMany({ userId: params.id })
        .then(() => {
          User.findOneAndDelete({ userId: params.id })
            .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
              }
              res.json(dbUserData);
            });
        })
        .catch(err => res.json(err));
    },

    // /api/users/:userid/fiends/:friendId
    addFriend({ params }, res) {
     User.findOneAndUpdate(
       { _id: params.userId },
       { $push: { friends: params.friendId } },
       { new: true }
      )
       .then((dbUserData) => {
         if (!dbUserData) {
           res.status(404).json({ message: 'No user found with this id' });
            return;
         }
          res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  }
};


module.exports = userController;