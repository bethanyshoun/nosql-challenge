const { User } = require('../models');

//create a userController object with two methods for adding/removing comments
const userController = {
    // get all thoughts function 
    getAllUser(req, res) {
      User.find({})
      .populate({
        path: 'users',
        select: '-__v'
      })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbSocialData => res.json(dbSocialData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one by id
    getUsertById({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({
          path: 'users',
          select: '-__v'
        })
        .select('-__v')
        .then(dbSocialData => {
          // If no thought is found, send 404
          if (!dbSocialData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbSocialData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //create User
    createUser({ body }, res) {
        User.create(body)
            .then(dbSocialData => res.json(dbSocialData))
            .catch(err => res.status(400).json(err));
    },

    //update User by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbSocialData => {
                if (!dbSocialData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbSocialData => {
                if (!dbSocialData) {
                    //???
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err));
    }
}


module.exports = userController;