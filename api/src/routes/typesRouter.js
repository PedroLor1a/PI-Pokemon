const { Router } = require("express");
const { getTypeApi } = require("../controllers/TypeController");

const router = Router();

// get types
router.get("/", async (req, res) => {
  const resultType = await getTypeApi();
  res.json(resultType);
});

module.exports = router;
