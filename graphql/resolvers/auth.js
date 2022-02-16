const bcrypt = require('bcryptjs')

const User = require('../../models/user');

module.exports = {  
  
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