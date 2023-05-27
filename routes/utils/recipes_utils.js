const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */



async function getRandom(){
    let recipe= await axios.get(`${api_domain}/random`, {
        params: {
            number: 1,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return recipe;
}



async function search(query, number) {
    let recipes= await axios.get(`${api_domain}/complexSearch`, {
        params: {
            number: number,
            query: query,
            // cuisine: cuisine,
            // diet: diet,
            // intolerances: intolerances,
            instructionsRequired: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return recipes;
}

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree
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

