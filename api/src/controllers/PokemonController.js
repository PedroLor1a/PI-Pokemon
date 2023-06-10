const URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
const axios = require("axios");
const { AllPokemons, Type } = require("../db");

const getPokemonsApi = async () => {
  try {
    const pokemonsRequest = await axios.get(URL); // pedis todos los pokemons
    const pokemonsSubrequest = pokemonsRequest.data.results.map((obj) =>
      axios.get(obj.url)
    ); // te guardas todas las url de cada pokemon en un array
    const pokemonsInfoUrl = await axios.all(pokemonsSubrequest); // pedis toda la info a partir de esas url
    let pokemons = pokemonsInfoUrl.map((obj) => obj.data); // el axios te deja una banda de boludeces asique le pedis solamente la data que es lo que te interesa
    let pokemonsInfo = pokemons.map((pokemon) => objPokemonsApi(pokemon)); // llamas a la funcion que declaras mas abajo para poder convertir esa data malarda en un objeto ordenadito :3
    return pokemonsInfo; // devolver toda la info
  } catch (error) {
    console.error("Error in getPokemonsApi:", error.message);
    return error;
  }
};

// Get Pokemon object from API.
const objPokemonsApi = (p) => {
  const objPokeapi = {
    id: p.id,
    name: p.name,
    health: p.stats[0].base_stat,
    attack: p.stats[1].base_stat,
    defense: p.stats[2].base_stat,
    img: p.sprites.other["official-artwork"].front_default,
    types:
      p.types.length < 2
        ? [p.types[0].type.name]
        : [p.types[0].type.name, p.types[1].type.name],
  };

  return objPokeapi;
};

const getPokemonsDb = async () => {
  try {
    return (
      await AllPokemons.findAll({
        include: {
          model: Types,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      })
    ).map((pokemon) => {
      const json = pokemon.toJSON();
      return {
        ...json,
        types: json.types?.map((type) => type.name),
      };
    });
  } catch (error) {
    console.error("Error in dbPokemons:", error.message);
  }
};

const getAllPokemons = async () => {
  try {
    const pokemonApiData = await getPokemonsApi();
    const pokemonDbData = await getPokemonsDb();
    return [...pokemonApiData, pokemonDbData];
  } catch (error) {
    console.error("Error in getAllPokemons:", error.message);
    return error;
  }
};

const getPokemonByName = async (name) => {
  try {
    const buscarPoke = await AllPokemons.findOne({
      where: {
        name: name,
      },
    });
    if (buscarPoke) {
      return { buscarPoke };
    } else {
      let data = [];

      name = name.toLowerCase().trim();

      // Fetch to API
      let request = await axios(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      ).then((res) => res.data);
      data.push(request);

      return data.map((p) => {
        return {
          id: p.id,
          name: p.name,
          health: p.stats[0].base_stat,
          attack: p.stats[1].base_stat,
          defense: p.stats[2].base_stat,
          speed: p.stats[5].base_stat,
          height: p.height,
          weight: p.weight,
          sprite: p.sprites.other["official-artwork"].front_default,
          types:
            p.types.length < 2
              ? [p.types[0].type.name]
              : [p.types[0].type.name, p.types[1].type.name],
        };
      });
    }
  } catch (error) {
    console.error(`No existe el Pokemon ${name} en la DB ni en la API`);
    return `No existe el Pokemon ${name} en la DB ni en la API `;
  }
};

const createPokemon = async (
  name,
  health,
  attack,
  defense,
  createdInDb,
  image,
  types
) => {
  try {
    const newPokemon = await AllPokemons.create({
      name,
      health,
      attack,
      defense,
      createdInDb,

      image,
    });

    await Type.findAll({
      where: {
        name: types,
      },
    }).then((res) => newPokemon.addTypes(res));

    return "Your pokemon was successfully created";
  } catch (error) {
    console.error("Error in createPokemon:", error.message);
  }
};

module.exports = {
  getAllPokemons,
  getPokemonsApi,
  getPokemonsDb,
  getPokemonByName,
  createPokemon,
};
