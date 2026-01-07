import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl:   './logincomponent.html', 
  styleUrls: ['./logincomponent.css'],
  imports: [
    CommonModule,      
    FormsModule,        
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  hidePassword = true;
  showErrorModal = false;
  router = inject(Router);

  constructor(private auth: AuthService) {} 

  login() {

    if (!this.email || !this.password) {
      this.showErrorModal = true;
      return;
    }
    
    const data: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.auth.login(data).subscribe({
      next: res => {
        console.log('LOGIN SUCCESS', res); 
        this.auth.saveAuth(res.token, res.roles);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error(err);
        this.error = 'Invalid credentials';
        this.showErrorModal = true; 
      }
    });
  }

  onSubmit(loginForm: any) {
    
    Object.keys(loginForm.controls).forEach(key => {
      loginForm.controls[key].markAsTouched();
    });

    if (loginForm.invalid) {
      this.showErrorModal = true;
      return;
    }

    this.login();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}

