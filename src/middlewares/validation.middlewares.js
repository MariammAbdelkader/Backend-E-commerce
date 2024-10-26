const Joi = require("joi");
const { InvalidParameterError } = require("../exceptions/httpExceptions");

const validate = (schema, property) => {
  return (req, res, next) => {
    
  
    const { error } = schema.validate(req[property], { abortEarly: false });
    

    if (error) {
      //  console.log(error);
      const errorMessage = `Please check your input and try again`;
      console.log(error.details[0]);

      const errors = error.details.map((error) => {
        const key = error.context.key;
        return { [key]: error.message };
      });
     // console.log(errors);
    //   res.status(400).json(error.details[0].message);
      
      const validationError = new InvalidParameterError(errorMessage, errors);
      next(validationError);
    // next(error);
    } else {
      next();
    }
  };
};

module.exports = validate;