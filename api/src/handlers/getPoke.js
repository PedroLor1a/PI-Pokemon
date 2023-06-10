const {
  getPokemonByName,
  getAllPokemons,
} = require("../controllers/PokemonController");

const getPoke = async (req, res) => {
  const { name } = req.query;
  const result = name ? await getPokemonByName(name) : await getAllPokemons();
  try {
    res.status(200).json(result);
  } catch (error) {
    res.status(404).send("No se encontro Pokemon");
  }
};

module.exports = {
  getPoke,
};
