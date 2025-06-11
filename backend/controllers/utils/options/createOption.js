const Option = require("../../../models/options/Option");
const createOption = async (data) => {
  try {
    return await Option.create({
      ...data,
    });
  } catch (error) {
    console.error("Error creating Option:", error);
    throw new Error("Failed to create Option");
  }
};

module.exports = createOption;
