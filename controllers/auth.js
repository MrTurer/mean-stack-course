const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async (req, res) => {
    const condidate = await User.findOne({email: req.body.email});

    if (condidate) {
        //    Пользователь существует, проверка пароля
        const passwordResult = bcrypt.compareSync(req.body.password, condidate.password)
        if (passwordResult) {
        //    Генерация токена, пароли совпали
            const token = jwt.sign({
                email: condidate.email,
                userId: condidate._id,
            }, keys.jwt, {expiresIn: 60 * 60});

            res.status(200).json({
                token: `Bearer ${token}`,
            })
        } else {
            res.status(401).json({
                message: "Пароли не совпадают."
            })
        }
    } else {
    //    ошибка нет пользователем
        res.status(404).json({
            message: "Такой email не зарегистрирован"
        })
    }
}

module.exports.register = async (req, res) => {
    const condidate = await User.findOne({email: req.body.email});

    if (condidate) {
    //    Пользователь существует, ошибка
        res.status(409).json({
            message: "Такой email уже занят."
        })
    } else {
    //     создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
        //    обработать ошибку
            errorHandler(res, e)
        }
    }
}