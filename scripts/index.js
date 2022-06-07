// build a recipe card DOM
function createRecipeCard(recipe) {

    const { id, name, ingredients, time, description } = recipe;

    // recipe picture
    const recipeCardPicture = document.createElement('div');
    recipeCardPicture.classList = "recipe-card__picture";
    
    // recipe name
    const recipeNameH2 = document.createElement( 'h2' );
    recipeNameH2.textContent = name;

    // recipe duration
    const clockIcon = document.createElement('i');
    clockIcon.classList = "fa-regular fa-clock";
    const recipeDurationSpan = document.createElement( 'span' );
    recipeDurationSpan.classList = "duration";
    recipeDurationSpan.textContent = time + " min";

    const recipeDurationDiv = document.createElement( 'div' );
    recipeDurationDiv.append(clockIcon, recipeDurationSpan);

    // recipe card header
    const recipeCardHeaderDiv = document.createElement('div');
    recipeCardHeaderDiv.classList = "recipe-card__header";
    recipeCardHeaderDiv.append(recipeNameH2, recipeDurationDiv);
    
    // recipe ingredients
    const recipeCardIngredientsList = document.createElement( 'ul' );
    recipeCardIngredientsList.classList = "recipe-card__ingredients"

    ingredients.forEach((ingredient) => {
        const ingredientNameSpan = document.createElement( 'span' );
        ingredientNameSpan.classList = "recipe-card__ingredients__name";
        const ingredientQuantitySpan = document.createElement( 'span' );
        ingredientNameSpan.textContent = ingredient.ingredient + ": ";
        ingredientQuantitySpan.textContent = ingredient.quantity + " ";
        const ingredientLi = document.createElement( 'li' );
        ingredientLi.append(ingredientNameSpan, ingredientQuantitySpan);
        recipeCardIngredientsList.appendChild(ingredientLi);
    });
    
    // recipe description
    const recipeCardDescription = document.createElement( 'p' );
    recipeCardDescription.classList = "recipe-card__description"
    recipeCardDescription.textContent = description;

    // recipe card detail section
    const recipeCardDetailsDiv = document.createElement('div');
    recipeCardDetailsDiv.classList = "recipe-card__details";
    recipeCardDetailsDiv.append(recipeCardIngredientsList, recipeCardDescription);

    // recipe card text section
    const recipeCardTextSection = document.createElement('div');
    recipeCardTextSection.classList = "recipe-card__text-section";
    recipeCardTextSection.append(recipeCardHeaderDiv, recipeCardDetailsDiv);

    // append all relevant elements to an article element
    const recipeCard = document.createElement( 'article' );
    recipeCard.id = id;
    recipeCard.classList = "recipe-card";
    recipeCard.append(recipeCardPicture, recipeCardTextSection);

    return recipeCard   
}


// update dropdowns with relevant items, i.e. from the recipes shown on the page
// function updateDropdownItems(dropdownId) {
//     const shownRecipesIds;
//     switch (dropdownId) {
//         case "ingredients":



//             break;
//         case "appliance":
            
//             break;
//         case "utensils":
            
//             break;    
//         default:
//             break;
//     }
// }


// function showListbox(dropdownId) {
//     const searchList = getElementById("ingredients_searchlist")
//     searchList.classList.toggle("hidden");
//     sortButton.classList.toggle("hidden");
//     sortButton.setAttribute("aria-expanded", "true");
// }
  
// function hideListbox(dropdownId) {
//     searchableList.classList.toggle("hidden");
//     sortButton.classList.toggle("hidden");
//     sortButton.removeAttribute("aria-expanded");
// }


// addTag, removeTag



const recipesSection = document.getElementById("search-results");

recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    recipesSection.appendChild(recipeCard);
})

const allRecipesIds = recipes.map(recipe => recipe.id)

// updateDropdownItems("ingredients");
