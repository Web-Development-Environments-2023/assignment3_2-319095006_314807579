var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/getRandomRecipes",async (req,res,next)=>{
  try{
    const randomRec = await recipes_utils.getRandom();
    res.send(randomRec);
  }catch (error) {
    if (error.isAxiosError) {
      console.log('Axios-specific error occurred:');
      console.log('Error message:', error.message);
      console.log('Response:', error.response);
      console.log('Request:', error.request);
      console.log('Config:', error.config);
    } else {
      console.log('Other error occurred:', error);
    }
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } 
  catch(error){
    next(error);
  }
});




module.exports = router;
