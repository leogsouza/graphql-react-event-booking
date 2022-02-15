const bcrypt = require('bcryptjs')

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventIds) => {
  const events = await Event.find({
    _id: {
      $in: eventIds
    }
  })
  return events.map(event => {
    return {
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event.creator)
    };
  });
}

const user = async (userId) => {
  try {
    const userFound = await User.findById(userId)

    return {
      ...userFound._doc,
      _id: userFound.id,
      createdEvents: events.bind(this, userFound._doc.createdEvents)
    }
  } catch (error) {
    throw error;
  }

}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator');
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (error) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '620bfe8dbee2bbe4f0923869'
    })

    try {
      const result = await event.save()

      const createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      }
      const userFound = await User.findById('620bfe8dbee2bbe4f0923869');
      if (!userFound) {
        throw new Error('User not found.')
      }

      userFound.createdEvents.push(event);
      await userFound.save();
      return createdEvent;

    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const userExists = await User.exists({
        email: args.userInput.email
      });
      if (userExists) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();
      return {
        ...result._doc,
        password: null,
        _id: user.id
      }
    } catch (error) {
      throw error
    }

  }
}