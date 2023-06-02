const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");
// const DButils = require("./DButils");



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
         saved = await user_utils.checkFavorite(user_id, recipe_id);
         already  = await user_utils.checkViewed(user_id, recipe_id);
    }
  
    let recipe_info = await getRecipeInformation(recipe_id);
    //check if the recipe is in lastviewed table with 
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
exports.getFullRecipeDetails = getFullRecipeDetails;
exports.search = search;

