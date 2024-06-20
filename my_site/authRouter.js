const Router = require('express')
const router = new Router()
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const courseController = require('./controllers/courseController')
const {check} = require("express-validator")

router.post('/registration',[check('username', "Имя пользователя не может быть пустым!").notEmpty(),
                            check ('password', "Пароль должен быть больше 4 и меньше 20 символов!").isLength({min:4, max:20})], authController.registration)
router.post('/login', authController.login)
router.get('/users', userController.getUsers)
router.get('/courses', courseController.getCourses)
router.post('/addUser', userController.addUser)
router.post('/addCourse', courseController.addCourse)
router.get('/personalAccount/:username', userController.getUserPersonalAccount)
router.put('/courses/:id', courseController.updateCourse)
router.delete('/userDelete/:username', userController.userDelete)
router.delete('/deleteCourse/:id',courseController.deleteCourse)
router.patch('/courses/:id', courseController.updateCourse)

module.exports = router