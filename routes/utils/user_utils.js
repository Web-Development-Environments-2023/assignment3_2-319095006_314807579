const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
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
    await DButils.execQuery(
    `INSERT INTO myrecipes VALUES ('${user_id}',NULL,'${recipe_details.image}', '${recipe_details.name}', '${recipe_details.time}',
    '${recipe_details.likes}', '${recipe_details.vegan}', '${recipe_details.gluten_free}','${recipe_details.already}','${recipe_details.saved}',
    '${recipe_details.ingredients}','${recipe_details.instructions}','${recipe_details.meals}')`);
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
    const recipes = await DButils.execQuery(`select recipe_id, source from lastviewed where user_id='${user_id}'`);
    return recipes;
}




async function addLastViewed(user_id, recipeId, source)
{
    //check if there are already three recipes with the user_id and delete the oldest one
    const recipes = await DButils.execQuery(`select recipe_id, source from lastviewed where user_id='${user_id}' order by time asc`);
    //check in recipes if already in the recipes with the same recipe_id and source
    for (let i = 0; i < recipes.length; i++) {
        if(recipes[i].recipe_id==recipeId && recipes[i].source==source){
            //delete the recipe from the table
            await DButils.execQuery(`delete from lastviewed where user_id='${user_id}' and recipe_id='${recipeId}' and source='${source}'`);
            console.log("deleted recipe with recipeid "+recipeId+" and source "+source+" from lastviewed");
            //add the recipe with the updated time
            await DButils.execQuery(`insert into lastviewed values ('${user_id}',${recipeId}, NOW(), '${source}')`);
            console.log("added recipe a second time with recipeid "+recipeId+" and source "+source+" to lastviewed");
            return;
        }
    }
    if(recipes.length>=3){
        await DButils.execQuery(`delete from lastviewed where user_id='${user_id}' and recipe_id='${recipes[0].recipe_id}'`);
        console.log("deleted oldest recipe with recipeid "+recipes[0].recipe_id+" from lastviewed");
    }
    await DButils.execQuery(`insert into lastviewed values ('${user_id}',${recipeId}, NOW(), '${source}')`);
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