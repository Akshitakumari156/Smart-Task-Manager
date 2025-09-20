const Joi=require("joi");

const taskValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().allow(""),
    priority: Joi.string().valid("Low", "Medium", "High").default("Low"),
    status: Joi.string().valid("To Do", "In Progress", "Completed").default("To Do"),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.array().items(Joi.string().hex().length(24)).required(),
    createdBy: Joi.string().hex().length(24).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error: error.details[0].message });
  }
  next();
};

module.exports={
    taskValidation
}