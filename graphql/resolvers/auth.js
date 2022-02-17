const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

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
  },
  login: async ({email, password}) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Credentials are incorrect!')
    }

    const token = jwt.sign({userId: user.id, email: user.email},process.env.SECRET_KEY,{
      expiresIn: '1h'
    });

    return {
      userId: user.id, 
      token,
      tokenExpiration: 1
    };
  }
}