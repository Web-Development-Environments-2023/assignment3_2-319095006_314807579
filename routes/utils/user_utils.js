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

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.createRecipe=createRecipe;
exports.getMyRecipes=getMyRecipes;
exports.getMyFamilyRecipes=getMyFamilyRecipes;
exports.getFullRecipeDetails=getFullRecipeDetails;