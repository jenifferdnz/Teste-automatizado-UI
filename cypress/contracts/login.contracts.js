const Joi = require ('joi')

const loginSchema = Joi.object({
    quantidade: Joi.number(),
    usuarios: Joi.array(),
    nome: Joi.string(),
    email: Joi.string(),
    passoword: Joi.number(),
    administrador: Joi.boolean(),
    _id: Joi.string()

})
export default loginSchema;