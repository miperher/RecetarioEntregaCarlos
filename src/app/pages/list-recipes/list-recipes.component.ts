import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FireService } from '../../services/fire.service';
import { FormModalComponent } from '../../modal/form-modal/form-modal.component';

@Component({
  selector: 'app-list-recipes',
  standalone: true,
  imports: [NgClass, FormModalComponent],
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.css']
})
export class ListRecipesComponent {
  api = inject(ApiService);
  router = inject(Router);
  fire = inject(FireService);

  @Input() type: string = '';
  @Input() subtype: string = '';

  isModalOpen: boolean = false;
  recipeToEdit: any = null; // Para almacenar los datos de la receta a editar

  $state: WritableSignal<any> = signal({
    loading: false,
    error: false,
    data: []
  });

  ngOnInit() {
    // Al inicio del componente
    this.fetchData();
  }

  fetchData() {
    // Llamar al servicio
    this.$state.update(state => ({ ...state, loading: true }));

    let request;
    console.log('Fetching data');
    switch (this.type) {
      case 'category':
        request = this.api.getRecipesByCategory(this.subtype);
        break;
      case 'nationality':
        request = this.api.getRecipesByNationality(this.subtype);
        break;
      case undefined:
        request = this.fire.getRecipesWithID();
        break;
      default:
        console.log('Fetching favourites');
        this.fire.getRecipes().subscribe(data => {
          console.log(data);
        });
    }

    if (request) {
      // Subscribo al observable
      (request as any).subscribe({
        next: (data: any) => {
          this.$state.update(state => ({
            ...state,
            loading: false,
            error: false,
            data: data
          }));
        },
        error: (err: any) => {
          this.$state.update(state => ({
            ...state,
            loading: false,
            error: err,
            data: []
          }));
        }
      });
    } else {
      // Error
      this.$state.update(state => ({
        ...state,
        loading: false,
        error: 'Categoría incorrecta'
      }));
    }
  }

  goToRecipe(idMeal: string) {
    if(this.type===undefined){
      this.router.navigate(['recipe/favorites', idMeal]);
    }
    else{
      this.router.navigate(['recipe', idMeal]);
    }
   
  }

  openModal() {
    this.isModalOpen = true; // Abrir el modal
    history.pushState({}, document.title); // Para manejar el historial
  }

  closeModal() {
    this.isModalOpen = false; // Cerrar el modal
    history.back();
  }

  async deleteRecipe(idMeal: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      try {
        await this.fire.deleteRecipe(idMeal);
        this.fetchData();
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
      }
    }
  }

  editRecipe(idMeal: string): void {
    this.router.navigate([`/favorites/edit/${idMeal}`]);
  }
}