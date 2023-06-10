const { Router } = require("express");
const {
  getAllPokemons,
  getPokemonByName,
  getPokemonsDb,
  createPokemon,
} = require("../controllers/PokemonController");
const { getPoke } = require("../handlers/getPoke");

const router = Router();

// get pokemons y get pokemons por name
router.get("/", getPoke);

// get pokemons por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //console.log(req.params);
  const allPokemons = await getAllPokemons();
  //console.log(allPokemons);

  try {
    if (id) {
      const pokemonId = await allPokemons.filter((e) => e.id == id);

      if (pokemonId) {
        res.status(200).json(pokemonId);
      } else {
        res.status(404).send("Pokemon not found");
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  const { name, health, attack, defense, createdInDb, types, image } = req.body;

  const newPokemon = await createPokemon(
    name,
    health,
    attack,
    defense,
    createdInDb,
    types,
    image
  );

  return res.status(200).send(newPokemon);
});

module.exports = router;
