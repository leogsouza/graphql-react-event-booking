const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator');
      return events.map(event => {
        return transformEvent(event);
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

      const createdEvent = transformEvent(result);
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
  }
};