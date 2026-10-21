import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
},

//Ventana Loguin
{
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
    .then(m => m.Login)
},

//Menu principal
{
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
    .then(m => m.Dashboard)
},

//Pagina no encontrada
{
    path: '**',
    redirectTo: 'login'
}];
