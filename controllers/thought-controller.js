const { User, Thought } = require('../models');


// ***DOES THIS NEED TO BE IN USER Instead???
//create a thoughtController object with two methods for adding/removing thoughts
const thoughtController = {
  // get all thoughts 
  getAllThought(req, res) {
    Thought.find({})
    .populate({
      path: 'reactions',
      select: '-__v'
    })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  
  // get a thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thoughts found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create a newThought
  createThought({ body }, res) {
      Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.status(400).json(err));
  },

  //update a thought by its ID
  updateThought({ params, body }, res) {
      Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thoughts found with this id!' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
  },

  //delete a thought by ID
  deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  //???
                  res.status(404).json({ message: 'No thoughts found with this id!' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
  },

  //create a new reaction
  createReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId},
      {$push: {reactions: body}},
      {new: true, runValidators: true})
      .populate({path: 'reactions', select: '-__v'})
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({message: 'No thoughts with this ID.'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err))
  },
  //delete a reaction using thought id and reaction id
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No reaction with this ID exists.'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  }
};



module.exports = thoughtController;