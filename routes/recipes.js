var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/getRandomRecipes",async (req,res,next)=>{
  try{
    const randomRec = await recipes_utils.getRandom();
    res.status(200).send(randomRec.recipes);
  }catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFullRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } 
  catch(error){
    next(error);
  }
});


router.get("/search", async (req, res, next) => {
  try{
    const query = req.params.query;
    const number = req.params.number;
    console.log("im hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" + query, number);
    // const cuisine = req.query.cuisine;
    // const diet = req.query.diet;
    // const intolerances = req.query.intolerances;
    const recipes = await recipes_utils.search(query, number);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }
});




module.exports = router;
