const Option = require("../../../models/options/Option");
const logger = require("../../../config/logger");

const createOption = async (data) => {
  try {
    return await Option.create({ ...data });
  } catch (error) {
    logger.error({ message: "Error creating option", error: error.message });
    throw new Error("Failed to create Option");
  }
};

module.exports = createOption;
