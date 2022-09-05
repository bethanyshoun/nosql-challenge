const { User, Thought } = require('../models');


// ***DOES THIS NEED TO BE IN USER Instead???
//create a thoughtController object with two methods for adding/removing thoughts
const thoughtController = {
    // get all thoughts function 
    getAllThought(req, res) {
      Thought.find({})
      .populate({
        path: 'thoughts',
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
    getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v')
        .then(dbSocialData => {
          // If no thought is found, send 404
          if (!dbSocialData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbSocialData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //createThought
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbSocialData => res.json(dbSocialData))
            .catch(err => res.status(400).json(err));
    },

    //update thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbSocialData => {
                if (!dbSocialData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbSocialData => {
                if (!dbSocialData) {
                    //???
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err));
    }
}



module.exports = thoughtController;