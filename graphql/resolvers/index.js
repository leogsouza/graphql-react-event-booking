const bcrypt = require('bcryptjs')

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator)      

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
  bookings: async() => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      })
    } catch (error) {
      throw error;
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
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({_id: args.eventId});
    const booking = new Booking({
      user: '620bfe8dbee2bbe4f0923869',
      event: fetchedEvent
    });
    const result = await booking.save();
    return{
      ...result._doc, 
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = { 
        ...booking.event._doc, 
        _id: booking.event.id, 
        creator: user.bind(this, booking.event._doc.creator)
      };      
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (error) {
      throw error;
    }
  }
}