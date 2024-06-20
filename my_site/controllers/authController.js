const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const { secret } = require('../config')

const generateAccessToken = (id, role) => {
    const payload = { id, role }
    return jwt.sign(payload, secret, { expiresIn: "2h" })
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка при регистрации", errors })
            }

            const { username, password } = req.body
            const candidate = await User.findOne({ username })

            if (candidate) {
                return res.status(400).json({ message: "Пользователь с такими данными уже существует" })
            }

            const hashPassword = bcrypt.hashSync(password, 5);
            const user = new User({ username, password: hashPassword, role })
            await user.save()
            return res.json({ message: "Пользователь успешно зарегистрирован" })
        }

        catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Ошибка регистрации' })

        }

    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(400).json({ message: 'Введён неверный логин или пароль' })
            }

            const token = generateAccessToken(user._id, user.role)
            let redirectUrl = '';
            switch (user.role) {
                case 'Администратор':
                    redirectUrl = 'admin.html';
                    break;
                case 'Разработчик':
                    redirectUrl = 'developer.html';
                    break;
                case 'Пользователь':
                    redirectUrl = 'personal_account.html';
                    break;
                default:
                    redirectUrl = 'index.html';
            }
            return res.json({ token, role: user.role, redirectUrl })
        }
        catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Ошибка авторизации' })
        }

    }

}

module.exports = new AuthController()