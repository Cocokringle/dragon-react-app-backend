const {User} = require('../models/users')
const bcrypt = require('bcryptjs');


const getUserByEmail = async (userData) => {
    return User.findOne({email: userData.email})
}

const addUser = async (userData, verificationToken) => {
    const password = userData.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user =
    await User.create({
        ...userData,
        password: hashedPassword,
        verificationToken: verificationToken,
    });
    return user;
}

const updateToken = async (_id, token ) => {
    return User.findByIdAndUpdate(_id, {token} );
}

const deleteToken = async (_id, token) => {
    return User.findByIdAndUpdate(_id, token);
}

const findUserByToken = async(verificationToken) => {
    return User.findOne({verificationToken})
}

const updateVerificationToken = async(_id) => {
    return User.findByIdAndUpdate(_id, {verify: true, verificationToken: null});
}
module.exports = {
    getUserByEmail,
    addUser,
    updateToken,
    deleteToken,
    findUserByToken,
    updateVerificationToken,
}