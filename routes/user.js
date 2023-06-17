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
  console.log("session: ", req.session);
  console.log("session id: ", req.session.id);
  if (req.session && (req.body.username || req.session.user_id)) {
    if (req.body.username){
      DButils.execQuery("SELECT username, user_id FROM users").then((users) => {
        const user = users.find((x) => x.username === req.body.username);
        if (user) {
          req.session.user_id = user.user_id; // Save the user_id in the session
          next();
        } 
      }).catch(err => next(err));
    }
    else{
      DButils.execQuery("SELECT username, user_id FROM users").then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)){
          req.user_id = req.session.user_id; 
          next();
        } 
      }).catch(err=>next(err));
    }
  } else {
    res.sendStatus(401);
  }
});  
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT username, user_id FROM users").then((users) => {
//       if (users.find((x) => x.user_id === req.session.user_id)) {
//         req.user_id =req.sessin.user_id;
//         next();
//       }
//     }).catch(err => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });


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
    let favorite_recipes = [];
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    for (let i = 0; i < recipes_id_array.length; i++) {
      let ready= await recipe_utils.getRecipeDetails(recipes_id_array[i], user_id);
      favorite_recipes.push(ready);
    }
    // const results = await recipe_utils.getRecipeDetails(recipes_id_array, user_id); //--- CHANGED BY US
    res.status(200).send(favorite_recipes);
  } catch(error){
    next(error); 
  }
});

router.post("/newRecipe", async (req, res, next) => { 
  try {
      let recipe_details = {
        image: req.body.image,
        name: req.body.title,
        time: req.body.readyInMinutes,
        vegan:req.body.vegan,
        vegetarian:req.body.vegetarian,
        gluten_free:req.body.gluten_free,
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
        id: row.recipe_id,
        title: row.name,
        image: row.image,
        readyInMinutes: row.time,
        popularity: row.popularity,
        vegetarian: row.vegetarian,
        vegan: row.vegan,
        gluten_free: row.gluten_free     
      };
    });
    res.status(200).send(jsonArray);
  }catch(error){
    next(error)
  }
})


router.get("/lastViewed", async (req,res,next)=>{
  try {
    const user_id= req.session.user_id;
    const recipes = await user_utils.getLastViewed(user_id);
    if (recipes.length == 0) {
      res.status(200).send("No recipes found");
    }
    else {
      //get details for each of the ids in recipes
      for (let i = 0; i < recipes.length; i++) {
          const recipe = await recipe_utils.getRecipeDetails(recipes[i].recipe_id, user_id);
          recipes[i] = recipe;
      }
      res.status(200).send(recipes);
    }
  } catch (error) {
    next(error);
  }
})


router.get("/myFamilyRecipes", async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyFamilyRecipes(user_id);
    if (recipes.length == 0) {
      res.status(200).send("No recipes found");
    }
    else{
    res.status(200).send(recipes);
    }
  }catch(error){
    next(error)
  }
});


router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await user_utils.getFullRecipeDetails(req.params.recipeId);
    if (recipe.length == 0) {
      res.status(200).send("No recipes found");
    }
    else {
    const jsonArray = recipe.map((row) => {
      return {
        id: row.recipe_id,
        title: row.name,
        image: row.image,
        readyInMinutes: row.time,
        popularity: row.popularity,
        vegetarian: row.vegetarian,
        vegan: row.vegan,
        gluten_free: row.gluten_free,
        saved: row.saved,
        ingredients: row.ingredients,
        instructions: row.instruction,
        meals: row.meals
      };
    });
    if (req.session && req.session.user_id) {
      await user_utils.changeLastViewed(req.session.user_id, req.params.recipeId);
    }
    res.status(200).send(jsonArray);
  }
  } 
  catch(error){
    next(error);
  }
});




module.exports = router;
