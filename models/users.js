const {Schema, model} = require('mongoose')
const Joi = require('joi');


const schema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    token: {
        type: String,
        default: null,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },

  })

const User = model("user", schema)

const schemaRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const schemaLogin = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});


module.exports = {
  User,
  schemaRegister,
  schemaLogin,
}