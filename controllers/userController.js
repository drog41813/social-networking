const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find({})
        //.select('-__v');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        //.select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new tag
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      const thought = await Thought.findOneAndUpdate(
        { _id: req.body.thoughtId },
        { $addToSet: { users: user._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'User created, but found no thought with that ID' });
      }

      res.json('Created the tag 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({_id: req.params.userId});

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      // involve thought
      res.json({ message: 'User and Thoughts deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({_id: req.params.userId}, {$set: req.body} );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      // involve thought
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }, 
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId },{ $addToSet: { friends: req.params.friendId } },
        { new: true } );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      // involve thought
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }, 
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId },{ $pull: { friends: req.params.friendId } },
        { new: true } );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      // involve thought
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

