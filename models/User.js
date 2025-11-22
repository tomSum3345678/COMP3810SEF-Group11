// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: function () {
      return this.provider === 'google';  
    },
    unique: true,
    sparse: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local';  
    }
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  displayName: {
    type: String,
    required: function () {
      return this.provider === 'google';  // When login with google
    },
    default: function () {
      // If use username 或 email
      return this.username || this.email?.split('@')[0] || 'User';
    }
  },
  firstName: String,
  lastName: String,
  picture: String,
  role: {
    type: String,
    enum: ['end-user', 'staff', 'storage', 'manager'],
    default: 'end-user'
  },
  permissions: {
    type: [String],
    default: ['view_products', 'place_orders']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = this.username || this.email?.split('@')[0] || 'User';
  }
  //next();
});

userSchema.statics.findOrCreate = async function (googleProfile, callback) {
  try {
    let user = await this.findOne({ googleId: googleProfile.id });

    if (user) {
      user.lastLogin = new Date();
      user.picture = googleProfile.photos?.[0]?.value;
      await user.save();
      return callback(null, user);
    }

    const userId = 'USER' + Date.now().toString().slice(-6);

    user = await this.create({
      googleId: googleProfile.id,
      userId: userId,
      email: googleProfile.emails[0].value,
      provider: 'google',
      displayName: googleProfile.displayName,
      firstName: googleProfile.name?.givenName,
      lastName: googleProfile.name?.familyName,
      picture: googleProfile.photos?.[0]?.value,
      role: 'end-user',
      lastLogin: new Date()
    });

    return callback(null, user);
  } catch (error) {
    return callback(error, null);
  }
};

module.exports = mongoose.model('User', userSchema);
