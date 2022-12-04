import {useState,FormEvent} from 'react';

export default function ShareYourRecipes(){
    const [mealName,setMealName]=useState('');
    const [serves,setServes]=useState('');
    const [ingredients,setIngredients]=useState('');
    const [recipe,setRecipe]=useState('');
    const [sent,setSent]=useState<string|null>(null)
    async function submitRecipe(e:FormEvent){

    }
    return(
        <>
            <h1>Share Your Recipes</h1>
            <p>Use the form below to send a recipe to us and we&apos;ll post it.</p>
            <form>
                <div>
                    <label htmlFor="mealName">Name of meal</label>
                    <input id="mealName" placeholder="Name of meal" type="text"/>
                </div>
                <div>
                    <label htmlFor="serves">Serves</label>
                    <input id="serves"placeholder="how many people will this meal serve?" type="number"/>
                </div>
                <div>
                    <label htmlFor="ingredients">Ingredients</label>
                    <textarea id="ingredients"placeholder="ingredients"></textarea>
                </div>
                <div>
                    <label htmlFor="recipe">Recipe</label>
                    <textarea id="recipe" placeholder="Steps by step recipe"></textarea>
                </div>
                <button onSubmit={(e)=>submitRecipe(e)}>Submit</button>
                <p>{sent}</p>
            </form>
        </>
    )
}