const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokeRouter = require("./pokeRouter");
const typesRouter = require("./typesRouter");

const router = Router();

router.use("/pokemons", pokeRouter);
router.use("/types", typesRouter);
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
