// 
// Variables
// 

// DOM elements
const mainSearch = document.getElementById("main-search");
const tagsSection = document.getElementById("tags");
const filtersSection = document.getElementById("filters");
const activeTags = document.getElementsByClassName("tag");
const filterButtons = document.getElementsByClassName("button");
const recipesSection = document.getElementById("search-results");



//
// Functions and methods
// 

// get ingredients from list of recipes
function getIngredients(recipeList) {
    const ingredients = [];
    recipeList.forEach((recipe) => {
        recipe.ingredients.forEach((item) => {
            // if the ingredient isn't already listed in ingredients then add it to the list (avoids duplicates)
            if(!ingredients.some(e => e.toLowerCase() === item.ingredient.toLowerCase())) {
                ingredients.push(item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1))
            }
        })
    })
    return ingredients  
}

// get appliances from list of recipes
function getAppliances(recipeList) {
    const appliances = [...new Set(recipeList.map(recipe => recipe.appliance))];
    return appliances
}

// get utensils from list of recipes
function getUtensils(recipeList) {
    const utensils = [];
    recipeList.forEach((recipe) => {
        recipe.utensils.forEach((utensil) => {
            if(!utensils.some(e => e.toLowerCase() === utensil.toLowerCase())) {
                utensils.push(utensil.charAt(0).toUpperCase() + utensil.slice(1))
            }
        })
    })
    return utensils
}

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

// fill given DOM list with a set of options
function fillSearchList(searchListID, listOfOptions) {
    const listToFill = document.getElementById(searchListID);
    listToFill.replaceChildren();
    listOfOptions.forEach((option) => {
        const item = document.createElement("li");
        item.textContent = option;
        // extract the category from the list id, ingredient-list => ingredient
        item.dataset.category = searchListID.split("-")[0];
        listToFill.appendChild(item);
})
}

// create a tag element
function createTag(category, name) {
    const tag = document.createElement('button');
    tag.textContent = name;
    tag.dataset.category = category;
    tag.classList = `tag filter-block filter-block--${category}`;
    tagsSection.appendChild(tag);
}

function expandList(button) {
    button.classList.add("hidden");
    button.setAttribute('aria-expanded', true);
    const associatedList = button.nextElementSibling;
    associatedList.classList.remove("hidden");
    associatedList.setAttribute("aria-hidden", false);
    associatedList.firstElementChild.focus();  
}

function collapseList(button) {
    button.classList.remove("hidden");
    button.setAttribute('aria-expanded', false);
    const associatedList = button.nextElementSibling;
    associatedList.classList.add("hidden");
    associatedList.setAttribute("aria-hidden", true);
    // empty search field and reset filter list to show all possible values
    button.nextElementSibling.firstElementChild.value = "";
    filterSearchItemsWithString(button.nextElementSibling.id, "");
}

function handleListClosure(event) {
    let expandedList = document.querySelector("div [aria-hidden='false']");
    let target = event.target;
    if (expandedList) {
        if (!expandedList.contains(target)) {
            collapseList(expandedList.previousElementSibling);
        } else if (target.tagName == 'LI') {
            createTag(target.dataset.category, target.textContent)
            // close list and show button
            const associatedButton = target.parentElement.parentElement.previousElementSibling;
            collapseList(associatedButton);
            hideRecipesWithoutTag(target.dataset.category, target.textContent);
            updateFiltersOptions();
        }
    }
}

// update list of options in filters based on recipes shown and currently active tags
function updateFiltersOptions() {
    // get recipes objects of recipes shown on screen
    const recipesHiddenIDs = Array.from(document.getElementsByClassName("recipe-card hidden")).map(recipe => parseInt(recipe.id));
    const recipesShown = recipes.filter(recipe => !recipesHiddenIDs.includes(recipe.id));
    
    // get the lists of ingredients/utensils/appliances that are currently active as filters(tags)
    const selectedIngredientsTags = Array.from(document.querySelectorAll(".tag[data-category='ingredient']")).map(tag => tag.textContent);
    const selectedAppliancesTags = Array.from(document.querySelectorAll(".tag[data-category='appliance']")).map(tag => tag.textContent);
    const selectedUtensilsTags = Array.from(document.querySelectorAll(".tag[data-category='utensil']")).map(tag => tag.textContent);

    // possible elements belong to the recipes shown but are not already selected as a tag
    const possibleIngredients = getIngredients(recipesShown).filter((item) => !selectedIngredientsTags.includes(item));
    const possibleAppliances = getAppliances(recipesShown).filter((item) => !selectedAppliancesTags.includes(item));
    const possibleUtensils = getUtensils(recipesShown).filter((item) => !selectedUtensilsTags.includes(item));

    fillSearchList("ingredient-list", possibleIngredients.sort());
    fillSearchList("appliance-list", possibleAppliances.sort());
    fillSearchList("utensil-list", possibleUtensils.sort());

}

// filter items in a list to only keep those that contain a searchstring
function filterSearchItemsWithString(listId, searchString) {
    const ul = document.getElementById(listId);
    const li = ul.querySelectorAll("li:not([class='hidden'])")  
    // Loop through all list items, and hide those that don't match the search query
    for (i = 0; i < li.length; i++) {
      if (li[i].textContent.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
}

// return recipes object from recipes array of recipes shown on the screen
function getShownRecipesObjects() {
    const recipesShownIDs = Array.from(document.querySelectorAll("[class='recipe-card'")).map(recipe => parseInt(recipe.id));
    const recipesShown = recipes.filter(recipe => recipesShownIDs.includes(recipe.id));
    return recipesShown
}

// hide cards of recipes that do not contain the filter tag in their ingredient or appliance or utensil
function hideRecipesWithoutTag(tagCategory, tagName) {
    const recipesShown = getShownRecipesObjects();
    const recipesShownIDs = recipesShown.map(recipe => parseInt(recipe.id));

    let recipesToHide = [];
    switch (tagCategory) {
        case "ingredient":
            recipesToHide = recipesShownIDs.filter(id => !getRecipesWithIngredient(recipesShown, tagName).includes(id));
            break;
        case "appliance":
            recipesToHide = recipesShownIDs.filter(id => !getRecipesWithAppliance(recipesShown, tagName).includes(id));
            break;
        case "utensil":
            recipesToHide = recipesShownIDs.filter(id => !getRecipesWithUtensil(recipesShown, tagName).includes(id));
            break;    
        default:
            break;
    }
    recipesToHide.forEach(recipeID => hideElementWithID(recipeID));
}

// get a lowercase string with all ingredients in a given recipe object
function getRecipeIngredients(recipeObject) {
    let recipeIngredients = "";
    for (const item of recipeObject.ingredients) {
        recipeIngredients += item.ingredient.toLowerCase();
    }
    return recipeIngredients
}

// hide cards of recipes that do not contain the search string in their title or ingredients or description
function hideRecipesNotMatchingString(searchString) {
    const searchStringLower = searchString.toLowerCase();
    const recipesShown = document.querySelectorAll("[class='recipe-card'");

    // loop over recipe elements shown (i.e. not already hidden) to assess whether they should be hidden
    for (const recipeElement of recipesShown) {
        // get the recipe object matching the ID (the next lines are equivalent to an Array.find)
        for (const recipe of recipes) {
            if (recipe.id == recipeElement.id) {
                const recipeObject = recipe;
                break;        
            }
        }
        // if search string is not found in recipe name or description or ingredients then hide it, otherwise leave it (continue)
        if (recipeObject.name.toLowerCase().includes(searchStringLower)) {
            continue;
        } else if (recipeObject.description.toLowerCase().includes(searchStringLower)) {
            continue;
        } else if (getRecipeIngredients(recipeObject).includes(searchStringLower)) {
            continue;
        } else {
            hideElementWithID(recipeElement.id);
        }    
    }
}

// hide DOM elements with a given ID
function hideElementWithID(elementID) {
    document.getElementById(elementID).classList.add("hidden");
}

// unhide all recipes
function unhideAllRecipes() {
    const recipeCards = document.getElementsByClassName("recipe-card");
    for (const recipeCard of recipeCards) {
        recipeCard.classList.remove("hidden");
    }
}

// return list of ID of recipes that contain a given ingredient
function getRecipesWithIngredient(listOfRecipes, ingredient) {
    return listOfRecipes.filter(recipe => recipe.ingredients.some(e => e.ingredient.toLowerCase() === ingredient.toLowerCase())).map(recipe => recipe.id);
}

// return list of ID of recipes that use a given appliance
function getRecipesWithAppliance(listOfRecipes, appliance) {
    return listOfRecipes.filter(recipe => recipe.appliance.toLowerCase() === appliance.toLowerCase()).map(recipe => recipe.id);
}

// return list of ID of recipes that use a given utensil
function getRecipesWithUtensil(listOfRecipes, utensil) {
    return listOfRecipes.filter(recipe => recipe.utensils.some(e => e.toLowerCase() === utensil.toLowerCase())).map(recipe => recipe.id);
}

// refresh recipes cards results and dropdown list options based on tags and search string
function refreshResults() {
    unhideAllRecipes();
    // hide recipes not matching tag filters
    for (const tag of activeTags) {
        hideRecipesWithoutTag(tag.dataset.category, tag.textContent)
    }
    // hide recipes not matching search string
    if (mainSearch.value.length >= 3) {
        hideRecipesNotMatchingString(mainSearch.value);
    }
    updateFiltersOptions();
}



// 
// Inits & Event Listeners
// 

// INIT: populate page with recipe cards and fill dropdown lists with possible options

recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    recipesSection.appendChild(recipeCard);
})

fillSearchList("ingredient-list", getIngredients(recipes).sort());
fillSearchList("appliance-list", getAppliances(recipes).sort());
fillSearchList("utensil-list", getUtensils(recipes).sort());




// EVENT LISTENERS

// handle text search in main search bar
mainSearch.addEventListener('input', refreshResults);

// handle text search in the ingredients, appliances and utensils lists
filtersSection.addEventListener('input',(event) => {    
    const listId = event.target.id.split("-")[0]+"-list";
    const searchString = event.target.value;
    filterSearchItemsWithString(listId, searchString);
})

// handle dropdown lists expansion when the user clicks on the associated button
for (const button of filterButtons) {
    button.addEventListener("click", event => {
        event.stopPropagation();
        expandList(event.target);
    })
}

// handle closing/collapsing of any open dropdown list when the user clicks outside of it
window.addEventListener('click', handleListClosure)
window.addEventListener('focusin', handleListClosure)

// handle click events in the tag section - namely removing a tag when the user clicks on it
tagsSection.addEventListener('click', (event) => {
    let target = event.target;
    if(target.tagName == 'BUTTON') {
        target.remove();
        refreshResults();
    }
})