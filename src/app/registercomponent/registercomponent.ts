import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, RegisterRequest } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './registercomponent.html',
  styleUrls: ['./registercomponent.css'],
  imports: [
    CommonModule,      
    FormsModule,       
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,   
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ]
})
export class RegisterComponent {
  email = '';
  password = '';
  role = '';
  hidePassword = true;

  error = '';
  success = '';
  showErrorModal = false;
  router = inject(Router);

  roles = ['Admin', 'User'];

  constructor(private auth: AuthService) {}

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  register() {
    const data: RegisterRequest = {
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.auth.register(data).subscribe({
      next: res => {
        this.success = res.message;
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: err => {
        this.error = err.error?.message || 'Registration failed';
        this.success = '';
        this.showErrorModal = true;
      }
    });
  }

  onSubmit(registerForm: any) {
    
    Object.keys(registerForm.controls).forEach(key => {
      registerForm.controls[key].markAsTouched();
    });

    if (registerForm.invalid) { 
      this.showErrorModal = true;
      return;
    }

    this.register();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}

