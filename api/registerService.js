const _ = require('lodash')
const Register = require('./register')
const fullNameRegex = (/^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/)
const mailRegex = /\S+@\S+\.\S+/;
const phoneRegex = ('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$')


Register.methods(['get', 'post', 'put', 'delete'])
Register.updateOptions({ new: true, runValidators: true })

Register.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)
Register.before('post', register).before('put', register)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({ errors })
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

function register(req, res, next) {
  const fullName = req.body.fullName || ''
  const mail = req.body.mail || ''
  const phone = req.body.phone || ''
  const address = req.body.address || ''
  const number = req.body.number || ''
  const complement = req.body.complement || ''

  if (fullName == null || fullName == "") {
    return res.status(400).send({ alert: ["O campo Nome Completo é obrigatório."] })
  }
  if (!fullName.match(fullNameRegex)) {
    return res.status(400).send({ alert: ["Infomre o Nome e o Sobrenome."] })
  }

  if (mail == null || mail == "") {
    return res.status(400).send({ alert: ["O campo Email é obrigatório."] })
  }
  if (!mail.match(mailRegex)) {
    return res.status(400).send({ alert: ["O email informado é inválido. Informe um email non formato [nome@dominio.com ou nome@dominio.com.br]."] })
  }
  
  const newBody = new Register({
    fullName,
    mail,
    phone,
    address,
    number,
    complement
  })

  newBody.save(err => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      res.status(201).json(newBody)
    }
  })
}

module.exports = Register