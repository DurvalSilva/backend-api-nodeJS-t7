const res = require('express/lib/response')
const _ = require('lodash')
const Register = require('./register')
const fullNameRegex = [/^[/^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/]

Register.methods(['get', 'post', 'put', 'delete'])
Register.updateOptions({ new: true, runValidators: true })

Register.after('post', sendErrosOrNext).after('put', sendErrosOrNext)
Register.after('post', register).before('put', register)

function sendErrosOrNext(req, res, next) {
    const bundle = req.locals.bundle

    if (bundle.erros) {
        var erros = parseErros(bundles.erros)
        res.status(500).json({ erros })
    } else {
        next()
    }
}

function parseErros(nodeRestfulErros) {
    const errors = []
    _.forIn(nodeRestfulErros, error => error.push(error.message))
    return errors
}

const sendErrosFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErros.errors, error => errors.push(error.message))
    return res.status(400).json({ erros })
}

function register(req, res, next) {
    const fullName = req.body.fullName || ''
    const mail = req.body.mail || ''
    const phone = req.body.phone || ''
    const address = req.body.address || ''
    const number = req.body.number || ''
    const complement = req.body.complement || ''

    if (fullName == null || fullName == "") {
        return res.status(400).send({ alert: ["O campo Nome Completo é obrigatório"] })
    }

    if (!fullName.match(fullNameRegex)) {
        return res.status(400).send({ alert: ["Informe o Nome e o Sobrenome."] })
    }

    const newBody = new Register({
        fullName,
        mail,
        phone,
        address,
        number,
        complement,
    })

    newBody.save(err => {
        if (err) {
            return sendErrosFromDB(res, err)
        } else {
            res.status(201).json(newBody)
        }
    })
}
module.exports = Register