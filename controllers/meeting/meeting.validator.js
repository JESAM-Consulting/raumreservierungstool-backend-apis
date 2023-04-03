const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  create: validator({
    body: Joi.object({
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      name: Joi.string(),
      room_id: Joi.string(),
      length: Joi.number(),
      description: Joi.string().allow(null, ""),
      repeat: Joi.string().valid("daily", "weekly", "monthly", "yearly", "noRepeat", "custom").default("noRepeat"),
      interval: Joi.number().allow(null, ""),
      freq: Joi.string().allow(null, "")
    }),
  }),
  update: validator({
    body: Joi.object({
      startTime: Joi.string(),
      endTime: Joi.string(),
      startDate: Joi.string(),
      endDate: Joi.string(), name: Joi.string(),
      room_id: Joi.string(),
      length: Joi.number(),
      description: Joi.string().allow(null, ""),
      repeat: Joi.string().valid("daily", "weekly", "monthly", "yearly", "noRepeat", "custom"),
      interval: Joi.number().allow(null, ""),
      freq: Joi.string().allow(null, "")

    }),
    params: Joi.object({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  }),
  delete: validator({
    params: Joi.object({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  }),
  fetch: validator({
    query: Joi.object({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid ID"),
      search: Joi.string(),
      name: Joi.string(),
      startDate: Joi.string(),
      endDate: Joi.string(),
      length: Joi.number(),
      description: Joi.string(),
      time: Joi.string(),
      role_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid ID"),
      limit: Joi.number().default(100),
      sortBy: Joi.string().default("createdAt"),
      sortOrder: Joi.string().default(-1),
    }),
  }),
  createRoom: validator({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  }),
  updateRoom: validator({
    body: Joi.object({
      name: Joi.string(),
    }),
    params: Joi.object({
      room_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  }),
  fetchRoom: validator({
    query: Joi.object({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid ID"),
      search: Joi.string(),
      name: Joi.string(),
      limit: Joi.number().default(100),
      sortBy: Joi.string().default("createdAt"),
      sortOrder: Joi.string().default(-1),
    }),
  }),
};
