// 
// Variables
// 

// DOM elements
const mainSearch = document.getElementById("main-search");
const tagsSection = document.getElementById("tags");
const filtersSection = document.getElementById("filters");
const recipesSection = document.getElementById("search-results");

let recipesShownIDs = recipes.map(recipe => recipe.id);   //initially contains every recipe's ID

const allIngredients = [];
recipes.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
        // if the ingredient isn't already listed in allIngredients then add it to the list (avoids duplicates)
        if(!allIngredients.some(e => e.toLowerCase() === item.ingredient.toLowerCase())) {
            allIngredients.push(item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1))
        }
    })
})

const allAppliances = [...new Set(recipes.map(recipe => recipe.appliance))];

const allUtensils = [];
recipes.forEach((recipe) => {
    recipe.utensils.forEach((utensil) => {
        if(!allUtensils.some(e => e.toLowerCase() === utensil.toLowerCase())) {
            allUtensils.push(utensil.charAt(0).toUpperCase() + utensil.slice(1))
        }
    })
})


//
// Functions and methods
// 

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
    const listToFill = document.getElementById(searchListID)
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

// filter items in a list to only keep those that contain a searchstring
function filterSearchItems(listId, searchString) {
    const ul = document.getElementById(listId);
    const li = ul.getElementsByTagName('li');  
    // Loop through all list items, and hide those that don't match the search query
    for (i = 0; i < li.length; i++) {
      if (li[i].textContent.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
}

function hideRecipesWithoutTag(tagCategory, tagName) {
    const recipesShown = recipes.filter(recipe => recipesShownIDs.includes(recipe.id));
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
    recipesToHide.forEach(recipeID => {
        document.getElementById(recipeID).classList.add("hidden");
    });
    // update list of recipes shown
    recipesShownIDs = recipesShownIDs.filter(id => !recipesToHide.includes(id));
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



// 
// Inits & Event Listeners
// 


// INIT: populate page with recipe cards and fill dropdown lists with possible options

recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    recipesSection.appendChild(recipeCard);
})

fillSearchList("ingredient-list", allIngredients.sort());
fillSearchList("appliance-list", allAppliances.sort());
fillSearchList("utensil-list", allUtensils.sort());








// EVENT LISTENERS

// handle text search in main search bar
mainSearch.addEventListener('input', () => {
    if (mainSearch.value.length >= 3) {
        // filter recipes shown
        // filter list of options
    }
})

// handle text search in the ingredients, appliances and utensils lists
filtersSection.addEventListener('input',(event) => {    
    const listId = event.target.id.split("-")[0]+"-list";
    const searchString = event.target.value;
    filterSearchItems(listId, searchString);
})

// handle click events in the filter section
filtersSection.addEventListener('click',(event) => {    
    event.stopPropagation();
    let target = event.target;
    if(target.tagName == 'BUTTON') {
        event.preventDefault();
        target.classList.toggle("hidden");
        target.nextElementSibling.classList.toggle("hidden");
        target.nextElementSibling.firstElementChild.focus();

        // close list and show button when the user clicks outside of the filters section
        window.addEventListener('click', function(e){
            if (!document.getElementById(target.nextElementSibling.id).contains(e.target)){
            target.classList.toggle("hidden");
            target.nextElementSibling.classList.toggle("hidden");
            // empty search field and reset filter list to show all possible values
            // target.nextElementSibling.firstElementChild.value = "";
            // filterSearchItems(target.nextElementSibling.id, searchString);
          } 
        }, { once: true })

    }
    else if(target.tagName == 'LI') {
        createTag(target.dataset.category, target.textContent)
        // close list and show button
        const parentSearchList = target.parentElement.parentElement;
        parentSearchList.classList.toggle("hidden");
        parentSearchList.previousElementSibling.classList.toggle("hidden");
        // empty search field
        // remove selected field from options
        // filter recipes shown
        hideRecipesWithoutTag(target.dataset.category, target.textContent);
        // filter option lists
    }
})

// handle click events in the tag section - namely removing a tag when the user clicks on it
tagsSection.addEventListener('click', (event) => {
    let target = event.target;
    if(target.tagName == 'BUTTON') {
        target.remove();
        // to define
    }
})