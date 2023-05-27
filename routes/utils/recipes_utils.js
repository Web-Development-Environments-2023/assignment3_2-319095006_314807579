const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


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
        glutenFree: glutenFree,
        
    }
}

// async function getRecipesData(recipe){
//     let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
//     return {
//         id: id,
//         title: title,
//         readyInMinutes: readyInMinutes,
//         image: image,
//         popularity: aggregateLikes,
//         vegan: vegan,
//         glutenFree: glutenFree,
//         already:already,
//         saved:saved,
//         ingredients : ingredients, 
//         instructions:instructions,
//         meals:meals
//       }
//     }
    
//}
async function getRandom(){
    let recipe= await axios.get(`${api_domain}/random`, {
        params: {
            number: 1,
            limitLicense:true,
            tags: 'vegetarian',
            apiKey: process.env.spooncular_apiKey
        }
    });
    console.log(recipe.json.id)
    return recipe.json.id;
    // let randomRecipes = [];
    // for(let i=0;i<3;i++){
    //     randomRecipes[i] = getRecipesData(recipes[i]);
    // }
    // return randomRecipes;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandom = getRandom;
//exports.getRecipesData = getRecipesData;


