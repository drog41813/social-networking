const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()

      res.json(thoughts);
    } catch (err) {
      console.error({ message: err });
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })

      if (!thought) {
        return res.status(404).json({ message: 'No post with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new post
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        {_id: req.body.userId},
        { $addToSet: {thoughts: thought._id }},
        {new: true}
      );
      if(!user) {
        return res.status(404).json({ message: 'Thought created, but no user found with that ID' });
      }
      res.json('Created the thought 🎉');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$set: req.body}, 
        {runValidators: true, new: true} );

      if(!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }, 

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({_id: req.params.thoughtId});

      if(!thought) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      
      const user = await User.findOneAndUpdate(
        {_id: req.params.thoughtId}, {$pull: {thoughts: req.params.thoughtId}}, 
        {new: true} 
      )

      if (!user) {
        return res.status(404).json({
          message: 'No user with this id!'
        });
      }

    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate({_id: req.body.thoughtId},
        { $addToSet: {reactions: req.body }},
        {runValidators: true, new: true});

      if(!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      
      res.json(thought);

    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate({_id: req.body.thoughtId},
        { $pull: {reactions: { reactionId: req.params.reactionId} }},
        {runValidators: true, new: true});

      if(!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      
      res.json(thought);

    } catch (err) {
      res.status(500).json(err);
    }
  },
};
