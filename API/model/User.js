const mongoose = require("mongoose");
const bcrypt= require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Tên người dùng là duy nhất và không thể trống
    email: { type: String, required: true, unique: true }, // Email là duy nhất và không thể trống
    password: { type: String, required: true },
    displayName: { type: String, require: true },
    bio: { type: String },
    dob: { type: Date }, //date of birthday
    avatar: { type: String },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // Mảng các ObjectId của người dùng theo dõi
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // Mảng các ObjectId của người dùng đang theo dõi
    isFanpage: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model('User', userSchema)