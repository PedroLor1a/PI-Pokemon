const axios = require("axios");
const { Types } = require("../db");
const URL = "https://pokeapi.co/api/v2/type";

const addTypeDb = async () => {
  try {
    const reqType = await axios.get(URL);
    const resType = reqType.data.results;

    resType.map(({ name }) => {
      Types.create({
        name,
      });
    });
  } catch (error) {
    console.error(error);
  }
};
addTypeDb();

// Types are fetched from the database and sent to the router
const getTypeApi = async () => {
  const result = await Types.findAll();
  return result;
};

module.exports = {
  getTypeApi,
};
