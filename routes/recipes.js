var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/getRandomRecipes",async (req,res,next)=>{
  try{
    const randomRec = await recipes_utils.getRandom();
    //check for user id
    const user_id = req.session.user_id;
    //we want to take only id from the recipe object
    const jsonArray = randomRec.map((row) => {
      return {
        recipe_id: row.id,
      }
    });
    //iterate through jsonArray and get the full details of each recipe
    for (let i = 0; i < jsonArray.length; i++) {
      const recipe = await recipes_utils.getRecipeDetails(jsonArray[i].recipe_id, user_id);
      jsonArray[i] = recipe;
    }

    res.status(200).send(jsonArray);
  }catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */



router.get("/search", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const query = req.query.query;
    const number = req.query.number;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerances = req.query.intolerances;
    const sort = req.query.sort;
    const recipes = await recipes_utils.search(query, number, cuisine, diet, intolerances, sort);
    //retrun only id of the recipes 
    const jsonArray = recipes.map((row) => {
      return {
        recipe_id: row.id,
      }
    });
    //iterate through jsonArray and get the full details of each recipe
    for (let i = 0; i < jsonArray.length; i++) {
      const recipe = await recipes_utils.getRecipeDetails(jsonArray[i].recipe_id, user_id);
      jsonArray[i] = recipe;
    }

    res.status(200).send(jsonArray);
  }
  catch(error){
    next(error);
  }
});


router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFullRecipeDetails(req.params.recipeId);
    if (req.session && req.session.user_id) {
      await user_utils.addLastViewed(req.session.user_id, req.params.recipeId, 1);
    }

    res.send(recipe);
  } 
  catch(error){
    next(error);
  }
});




module.exports = router;
