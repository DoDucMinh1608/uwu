const { Schema, model } = require('mongoose')

const account = new Schema({
  name: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: [6, '{VALUE} is too short'] },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Others"] }
})

module.exports = model('account', account)