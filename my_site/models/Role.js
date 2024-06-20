const {Schema, model, models} = require('mongoose')

const Role = new Schema({
    name: { type: String, unique: true, default: "Пользователь"},
})

module.exports = model('Role', Role)