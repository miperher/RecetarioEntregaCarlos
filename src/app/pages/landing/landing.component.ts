import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  auth = inject(AuthService);
  router = inject(Router);
  constructor() {
    effect(() => {
      console.log("EFECTO"+this.auth.$isLoggedIn());
      if (this.auth.$isLoggedIn()) {
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['login']);
      }
    })
  }
}
