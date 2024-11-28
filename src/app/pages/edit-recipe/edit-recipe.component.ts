import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css'],
  imports: [NgIf, FormsModule],
})
export class EditRecipeComponent implements OnInit {
  recipeId: string = '';
  recipe: any = {
    strMeal: '',
    strMealThumb: '',
    strInstructions: '',
    strCategory: '',
    strArea: '',
    strYoutube: '',
  };

  constructor(
    private route: ActivatedRoute,
    private fireService: FireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.recipeId) {
      this.loadRecipe();
    }
  }

  loadRecipe(): void {
    this.fireService.getRecipeById(this.recipeId).subscribe((data) => {
      this.recipe = data || this.recipe; 
    });
  }

  saveChanges(): void {
    if (this.recipe) {
      this.fireService.updateRecipe(this.recipeId, this.recipe).then(() => {
        console.log('Receta actualizada con éxito');
        this.router.navigate(['/recipes/favorites']); 
      });
    }
  }
}