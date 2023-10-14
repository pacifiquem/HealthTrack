import Joi from "joi";

export const patientSchema = Joi.object({
  patient_name: Joi.string().required(),
  patient_national_id: Joi.string().required()
});

export const recordSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  body_temperature: Joi.number().min(0).required(),
  heart_rate: Joi.number().integer().min(0).required(),
});