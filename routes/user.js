var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const req = require("express/lib/request");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  console.log(req.session.user_id)
  try{
    const user_id = req.session.user_id;
   
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetails(recipes_id_array); //--- CHANGED BY US
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});
router.post("/newRecipe", async (req, res, next) => { // it is written in the document to open a modal, but i made it like register for now.
  try {
      let recipe_details = {
        image: req.body.image,
        name: req.body.name,
        time: req.body.time,
        likes:req.body.likes,
        vegan:req.body.vegan,
        gluten_free:req.body.gluten_free,
        already:req.body.already,
        saved:req.body.saved,
        ingredients : req.body.ingredients, 
        instructions:req.body.instructions,
        meals:req.body.meals
      }
      const user_id = req.session.user_id;
      await user_utils.createRecipe(recipe_details,user_id)
      res.status(200).send("The Recipe successfully saved in your recipes");
      }catch(error){
        next(error)
    }
    }
)
router.get("/myRecipes", async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);
    // let recipes_id_array = [];
    // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipesData(recipes_id_array); //--- CHANGED BY US
    res.status(200).send(recipes);
  }catch(error){
    next(error)
  }
})




module.exports = router;
