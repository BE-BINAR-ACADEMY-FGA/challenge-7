const { templateResponse } = require("../helpers/template-response");
const Joi = require("joi");
const CheckRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  if (req.body.password <= 8) {
    let respErr = templateResponse("error", "Password must be greater than 8");
    return res.json(respErr);
  }

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = templateResponse("error", error.details[0].message);
    return res.json(respErr);
  } else {
    next();
  }
};

module.exports = {
  CheckRegister,
};
