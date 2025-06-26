const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  },
  phone: {
  type: String,
  required: true,
  validate: {
    validator: function (v) {
      return /^\d{10}$/.test(v); // Adjust regex as needed for format
    },
    message: props => `${props.value} is not a valid phone number!`
  }
},
  password: { type: String },
  role: { type: String, enum: ['customer', 'driver'], required: true, default: "customer" },
  googleId: { type: String }  // ✅ NEW
});

// Only hash password if it's present (for email/password users)
userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
