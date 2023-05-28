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
        // likes:req.body.likes,
        vegan:req.body.vegan,
        vegeterian:req.body.vegeterian,
        gluten_free:req.body.gluten_free,
        // already:req.body.already,
        // saved:req.body.saved,
        ingredients : req.body.ingredients, 
        instructions:req.body.instructions,
        meals:req.body.meals
      }
      const user_id = req.session.user_id;
      await user_utils.createRecipe(recipe_details,user_id)
      res.status(201).send("The Recipe successfully saved in your recipes");
      }catch(error){
        next(error)
    }
    }
)
router.get("/myRecipes", async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);
    const jsonArray = recipes.map((row) => {
      return {
        recipe_id: row.recipe_id,
        image: row.image,
        name: row.name,
        time: row.time,
        vegan: row.vegan,
        gluten_free: row.gluten_free,
        likes: row.likes,
        saved: row.saved,
        already: row.already,
        ingredients: row.ingredients,
        instructions: row.instructions,
        meals: row.meals
      };
    });
    res.status(200).send(recipes);
  }catch(error){
    next(error)
  }
})


router.get("/lastViewed", async (req,res,next)=>{
  try {
    const user_id= req.session.user_id;
    const recipes = await user_utils.getLastViewed(user_id);
    //get details for each of the ids in recipes
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].source == 1){
        const recipe = await recipe_utils.getRecipeDetails(recipes[i].recipe_id);
        recipes[i] = recipe;
      }
      else{
         const recipe = await user_utils.getMyRecipeDetails(recipes[i].recipe_id);
         recipes[i] = recipe;
      }
    }
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
    

  }
})




router.get("/myFamilyRecipes", async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyFamilyRecipes(user_id);
    const jsonArray = recipes.map((row) => {
      return {
        recipe_id: row.recipe_id,
        user_id: row.user_id,
        name: row.name,
        time: row.time,
        ingredients: row.ingredients,
        instructions: row.instructions,
        holiday: row.holiday,
        family_member: row.family_member,
        image: row.image
      };
    });
    res.status(200).send(recipes);
  }catch(error){
    next(error)
  }
});


router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await user_utils.getFullRecipeDetails(req.params.recipeId);
    if (req.session && req.session.user_id) {
      await user_utils.addLastViewed(req.session.user_id, req.params.recipeId, 0);
    }
    res.status(200).send(recipe);
  } 
  catch(error){
    next(error);
  }
});




module.exports = router;
