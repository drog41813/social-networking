const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
        //.populate({ path: 'tags', select: '-__v' });

      res.json(thoughts);
    } catch (err) {
      console.error({ message: err });
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        //.populate({ path: 'tags', select: '-__v' });

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
};
