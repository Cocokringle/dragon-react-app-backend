const users = require('../services/users_service')
const { createError } = require('../helpers/errors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET_KEY} = process.env;
// const fs = require('fs/promises')
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res, next) => {

    try{
        
        const user = await users.getUserByEmail(req.body);
        if(user){
            throw createError(409, 'Email in use')
        }
        const verificationToken = uuidv4();
        const result = await users.addUser(req.body, verificationToken)

        res.status(201).json({
            user: {
            email: result.email,
            }
        })

        return result;
        
    } catch (e) {
        next(e)
    }
}

const loginUser = async (req, res, next) => {
    try{
        const user = await users.getUserByEmail(req.body);
        if(!user ){
            throw createError(401, 'Email or password is wrong')
        }
        const { password } = req.body
        const passCompare = await bcrypt.compare(password, user.password)
        if(!passCompare){
            throw createError(401, 'Email or password is wrong')
        }

        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})
        await users.updateToken(user._id, token)
        await 

        res.status(200).json({
            token: token,
            user: {
            email: user.email,
            }
        })

    } catch (e) {
        next(e)
    }

}

const logoutUser = async (req, res, next) => {
    const { _id } = req.user;

    if(!_id){
      throw createError(401, "Not authorized")
    }
    
    await users.deleteToken(_id, {token: null})
    res.status(204).json()

}

const getCurrentUser = async (req, res, next) =>{
    const {_id, email} = req.user
    res.status(200).json({
        user: {
            email: email,
            id: _id,
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
}