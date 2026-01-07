import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [


  {
    path: 'login',
    loadComponent: () =>
      import('./logincomponent/logincomponent')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./registercomponent/registercomponent')
        .then(m => m.RegisterComponent)
  },  

  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./employee-list/employee-list')
        .then(m => m.EmployeeList),
    canActivate: [authGuard]
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./employee-create/employee-create')
        .then(m => m.EmployeeCreate),
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./employee-edit/employee-edit')
        .then(m => m.EmployeeEdit),
    canActivate: [authGuard]
  },

  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  
  { path: '**', redirectTo: 'login' }
];
