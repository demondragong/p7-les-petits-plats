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


let selectedTags = [];
const recipesSection = document.getElementById("search-results");

recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    recipesSection.appendChild(recipeCard);
})

const allRecipesIds = recipes.map(recipe => recipe.id)

// list of all possible ingredients
const allIngredients = []
recipes.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
        if(!allIngredients.some(e => e.toLowerCase() === item.ingredient.toLowerCase())) {
            allIngredients.push(item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1))
        }
    })
})
fillSearchList("ingredient-list", allIngredients.sort());

// list of all possible appliances
const allAppliances = [...new Set(recipes.map(recipe => recipe.appliance))];
fillSearchList("appliance-list", allAppliances.sort());


// list of all possible utensils
const allUtensils = []
recipes.forEach((recipe) => {
    recipe.utensils.forEach((utensil) => {
        if(!allUtensils.some(e => e.toLowerCase() === utensil.toLowerCase())) {
            allUtensils.push(utensil.charAt(0).toUpperCase() + utensil.slice(1))
        }
    })
})
fillSearchList("utensil-list", allUtensils.sort());

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


// helper functions
/* 

- toggle between button and filter list: expand filter list / collapse filter list
- filterIngredientList, filterUtensilsList, filterAppliancesList based on recipes displayed
- filterIngredientList, filterUtensilsList, filterAppliancesList based on text input in filter search
- showCard / hideCard
- addTag / removeTag

- filter recipes with search string
- filter recipes with ingredient/appliance/utensil (remove recipes that do not have the ingredient/appliance/utensil)

*/


// event listeners
/* 
events to listen to:
- user text input in main search bar
    - filter recipes
    - filter option lists
- user click on filter button
    - hide button
    - show search list
- user click away from expanded search list
    - hide search list
    - show matching button
- user text input in filter search bar
    - filter items below / hide items that do not contain the searched string
- user click on filter item
    - remove item from list
    - create and display tag
    - filter recipes
    - filter option lists
- user click on tag/tag X
    - delete tag element
    - update recipes
    - update option lists
*/

const tagsSection = document.getElementById('tags');
const filtersSection = document.getElementById("filters");


function createTag(category, name) {
    const tag = document.createElement('button');
    tag.textContent = name;
    tag.classList = `tag filter-block filter-block--${category}`;
    tagsSection.appendChild(tag);
}

function filterSearchItems(listId, searchString) {
    const ul = document.getElementById(listId);
    const li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      if (li[i].textContent.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }




filtersSection.addEventListener('input',(event) => {    
    const listId = event.target.id.split("-")[0]+"-list";
    const searchString = event.target.value;
    filterSearchItems(listId, searchString)
})

filtersSection.addEventListener('click',(event) => {    
    let target = event.target;
    if(target.tagName == 'BUTTON') {
        event.preventDefault();
        target.classList.toggle("hidden");
        target.nextElementSibling.classList.toggle("hidden");
    }
    else if(target.tagName == 'LI') {
        console.log(target);
        createTag(target.dataset.category, target.textContent)
        selectedTags.push(target.textContent);
    }
})

tagsSection.addEventListener('click', (event) => {
    let target = event.target;
    if(target.tagName == 'BUTTON') {
        target.remove();
        selectedTags = selectedTags.filter(e => e !== target.textContent);
    }
})