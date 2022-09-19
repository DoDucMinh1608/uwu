const { Schema, model } = require('mongoose')

const account = new Schema({
  name: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: 6 },
  birthday: { type: Date, required: true },
  gender: {
    type: String, required: true, enum: [
      "male", "female", "others"
    ]
  }
})

module.exports = model('account', account)