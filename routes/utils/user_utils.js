const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
    await DButils.execQuery(`update myrecipes set saved='true' where recipe_id='${recipe_id}' and user_id='${user_id}'`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}
async function getMyRecipes(user_id){
    const recipes = await DButils.execQuery(`select * from myrecipes where user_id='${user_id}'`);
    return recipes;
}


async function getMyFamilyRecipes(user_id){
    const recipes = await DButils.execQuery(`select * from familyrecipes where user_id='${user_id}'`);
    return recipes;
}

async function createRecipe(recipe_details,user_id){
    console.log(recipe_details);
    await DButils.execQuery(
    `INSERT INTO myrecipes VALUES ('${user_id}',NULL,'${recipe_details.image}', '${recipe_details.name}', '${recipe_details.time}', 0, '${recipe_details.vegan}', '${recipe_details.gluten_free}','false', 'false','${recipe_details.ingredients}','${recipe_details.instructions}','${recipe_details.meals}', '${recipe_details.vegeterian}')`);
}



async function getFullRecipeDetails(recipeId) {
    const recipe = await DButils.execQuery(
        `select * from myrecipes where recipe_id='${recipeId}'`
    );
    return recipe;
}

async function getMyRecipeDetails(recipe_id)
{
    const recipe = await DButils.execQuery(
        `select  recipe_id, image, name, time, likes, vegan, gluten_free, already, saved from myrecipes where recipe_id='${recipe_id}'`
    );

    return recipe;
}

async function getLastViewed(user_id) {
    const recipes = await DButils.execQuery(`select recipe_id from lastviewed where user_id='${user_id}' order by time desc limit 3`);
    return recipes;
}

async function checkFavorite(user_id, recipe_id) {
    let fave = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    if (fave.length > 0)
    {
        return true;
    }
    return false;
    
}
async function checkViewed(user_id, recipe_id) {
    let recipe = await DButils.execQuery(`select recipe_id from lastviewed where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    if (recipe.length > 0)
    {
        return true;
    }
    return false;
}




async function addLastViewed(user_id, recipeId)
{
    //check if there are already three recipes with the user_id 
    const recipes = await DButils.execQuery(`select recipe_id from lastviewed where user_id='${user_id}' order by time asc`);
    //check in recipes if already in the recipes with the same recipe_id 
    for (let i = 0; i < recipes.length; i++) {
        if(recipes[i].recipe_id==recipeId){
            await DButils.execQuery(`delete from lastviewed where user_id='${user_id}' and recipe_id='${recipeId}'`);
            await DButils.execQuery(`insert into lastviewed values ('${user_id}',${recipeId}, NOW())`);
            return;
        }
    }
    await DButils.execQuery(`insert into lastviewed values ('${user_id}',${recipeId}, NOW())`);
}



async function changeLastViewed(user_id, recipeId)
{
    //change the field already in the table myrecipes to true
    await DButils.execQuery(`update myrecipes set already='true' where user_id='${user_id}' and recipe_id='${recipeId}'`);
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.createRecipe=createRecipe;
exports.getMyRecipes=getMyRecipes;
exports.getMyFamilyRecipes=getMyFamilyRecipes;
exports.getFullRecipeDetails=getFullRecipeDetails;
exports.getLastViewed=getLastViewed;
exports.addLastViewed=addLastViewed;
exports.getMyRecipeDetails=getMyRecipeDetails;
exports.changeLastViewed=changeLastViewed;
exports.checkFavorite=checkFavorite;
exports.checkViewed=checkViewed;