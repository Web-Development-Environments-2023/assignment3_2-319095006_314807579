const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */



async function getRandom(){
    let recipe= await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return recipe.data.recipes;
}


    async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}




async function search(query, number, cuisine, diet, intolerances, sort) {
    console.log(query, number)
    let recipes= await axios.get(` https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
            number: number,
            query: query,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            sort: sort,
            instructionsRequired: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return recipes.data.results;
}





async function getRecipeDetails(recipe_id, user_id) {
    let already = false;
    let saved = false;
    if (user_id) {
        //check if the recipe is in lastviewed table with source 1
        let fave = await DButils.execQuery(`select recipe_id, source from FavoriteRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
        let recipe = await DButils.execQuery(`select recipe_id, source from lastviewed where user_id='${user_id}' and recipe_id='${recipe_id}' and source=1`);
        if (recipe.length > 0) {
             already = true;}
        if (fave.length > 0) {
            saved = true;}
}

    let recipe_info = await getRecipeInformation(recipe_id);
    //check if the recipe is in lastviewed table with source 1
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        already: already,
        saved: saved
    }
}


async function getFullRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients, instructions } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        ingredients: extendedIngredients.map((ing) => ing.original),
        instructions: instructions
    }
}


exports.getRecipeDetails = getRecipeDetails;
exports.getRandom = getRandom;
//exports.getRecipesData = getRecipesData;
exports.getFullRecipeDetails = getFullRecipeDetails;
exports.search = search;

