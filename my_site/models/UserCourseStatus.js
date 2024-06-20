const {Schema, model, models} = require('mongoose')

const UserCourseStatus = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, required: true, default: 'В процессе обучения'},
})

module.exports = model('UserCourseStatus', UserCourseStatus)