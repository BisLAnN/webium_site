const User = require('../models/User');

class UserController {
    async getUsers(req, res) {
        try {
            const users = await User.find().populate('courses');
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
    

    async addUser(req, res) {
        try {
            const { username, password, role } = req.body;

            const newUser = new User({
                username,
                password,
                role
            });

            await newUser.save();

            res.status(200).json({ message: 'Пользователь успешно добавлен' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка при добавлении пользователя' });
        }
    }

    async userDelete(req, res) {
        const username = req.params.username;
        try {
            await User.findOneAndDelete({ username: username });
            res.json({ message: 'Пользователь был удален' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка при удалении пользователя' });
        }
    }

    async getUserPersonalAccount(req, res) {
        try {
            const user = await User.findOne({ username: req.params.username }).populate('courses');
            res.json(user);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
    
}

module.exports = new UserController();