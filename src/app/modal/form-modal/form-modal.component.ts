import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FireService } from '../../services/fire.service';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css'
})
export class FormModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<any>();

  fb = inject(FormBuilder);
  recipeForm!: FormGroup;
  fire = inject(FireService);


  categories = [
    'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 
    'Pork', 'Seafood', 'Side', 'Starter', 'Vegetarian'
  ];

  constructor() {
    this.recipeForm = this.fb.group({
      strMeal: new FormControl('', [Validators.required, Validators.minLength(3)]),
      strInstructions: new FormControl('', [Validators.required]),
      strMealThumb: new FormControl('', [Validators.required]), 
      strCategory: new FormControl('', [Validators.required]),
      strArea: new FormControl('', [Validators.required]), 

      ingredients: this.fb.array([
        this.fb.group({
          ingredient: new FormControl('', [Validators.required]),
          measure: new FormControl('', [Validators.required])
        })
      ])
    });
  }


  addIngredient() {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    if (ingredients.length < 20) {
      ingredients.push(
        this.fb.group({
          ingredient: new FormControl('', [Validators.required]),
          measure: new FormControl('', [Validators.required])
        })
      );
    }
  }


  removeIngredient(index: number) {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    if (ingredients.length > 1) {
      ingredients.removeAt(index);
    }
  }


  get ingredientControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  closeModal() {
    this.onClose.emit();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    this.onClose.emit("Me cierro");
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  async createRecipe() {
    if (this.recipeForm.invalid) {
      return;
    }

    try {
 
      const formValue = this.recipeForm.value;
      const formattedRecipe = {
        ...formValue,
       
        ...formValue.ingredients.reduce((acc: any, curr: any, index: number) => {
          acc[`strIngredient${index + 1}`] = curr.ingredient;
          acc[`strMeasure${index + 1}`] = curr.measure;
          return acc;
        }, {})
      };
      delete formattedRecipe.ingredients;

      let recipe = await this.fire.createRecipe(formattedRecipe);
      this.recipeForm.reset();
      this.closeModal();
    } catch (error) {
      alert("Error al crear la receta: " + error);
    }
  }
}