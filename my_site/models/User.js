const { Schema, model, ObjectId } = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    courses: [{ type: ObjectId, ref: 'Course' }],
});

module.exports = model('User', UserSchema);
