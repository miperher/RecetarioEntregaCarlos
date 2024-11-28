import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FireService } from '../../services/fire.service';
@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-favorites.component.html',
  styleUrl: './view-favorites.component.css'
})
export class ViewFavoriteComponent {
  fire = inject(FireService);

  /*
   @Input()
   id: string | undefined;
  */
  id = input.required<string>();

  $state: WritableSignal<any> = signal({
    data: null,
    loading: true,
    error: null
  })

  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.$state.update(state => {
      return { ...state, loading: true }
    });
    let request = this.fire.getRecipeById(this.id());
    request?.subscribe({
      next: (data: any) => {
        this.$state.update(state => {
          return { ...state, loading: false, data: data }
        });
      },
      error: (error: any) => {
        console.error(error)
        this.$state.update(state => {
          return { ...state, loading: false, data: [], error: error }
        });
        
      }
    })
  }
}
