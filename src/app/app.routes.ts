
import { Routes } from '@angular/router';

export const routes: Routes = [

  // Redireccionar al inicio de sesión
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Inicio de sesión
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  // Pantallas internas del hospital
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.Dashboard)
      },

      // Gestión de pacientes
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./features/pacientes/pacientes-lista/pacientes-lista')
            .then(m => m.PacientesLista)
      },

      // Gestión de médicos
      {
        path: 'medicos',
        loadComponent: () =>
          import('./features/medicos/medico-lista/medico-lista')
            .then(m => m.MedicoLista)
      },

      // Gestión de citas médicas
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/citas/citas-lista/citas-lista')
            .then(m => m.CitasLista)
      },

      // Historial clínico
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/historial/historial-lista/historial-lista')
            .then(m => m.HistorialLista)
      },

      // Gestión de usuarios
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios-lista/usuarios-lista')
            .then(m => m.UsuariosLista)
      },

      // Facturación
      {
        path: 'facturacion',
        loadComponent: () =>
          import('./features/facturacion/facturas-lista/facturas-lista')
            .then(m => m.FacturasLista)
      }

    ]
  },

  // Rutas no encontradas
  {
    path: '**',
    redirectTo: 'login'
  }

];
