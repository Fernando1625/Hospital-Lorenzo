import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redireccionar al inicio de sesión
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Inicio de sesión
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },

  // Pantallas internas del hospital
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),

    children: [
      // ==========================================
      // DASHBOARD
      // ==========================================
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      // ==========================================
      // GESTIÓN DE PACIENTES
      // ==========================================

      // Listado de pacientes
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./features/pacientes/pacientes-lista/pacientes-lista').then(
            (m) => m.PacientesLista,
          ),
      },

      // Registrar paciente
      {
        path: 'pacientes/nuevo',
        loadComponent: () =>
          import('./features/pacientes/paciente-formulario/paciente-formulario').then(
            (m) => m.PacienteFormulario,
          ),
      },

      // Editar paciente
      {
        path: 'pacientes/:id/editar',
        loadComponent: () =>
          import('./features/pacientes/paciente-formulario/paciente-formulario').then(
            (m) => m.PacienteFormulario,
          ),
      },

      // Consultar paciente
      {
        path: 'pacientes/:id',
        loadComponent: () =>
          import('./features/pacientes/paciente-detalle/paciente-detalle').then(
            (m) => m.PacienteDetalle,
          ),
      },

      // ==========================================
      // GESTIÓN DE MÉDICOS
      // ==========================================

      // Listado de médicos
      {
        path: 'medicos',
        loadComponent: () =>
          import('./features/medicos/medico-lista/medico-lista').then((m) => m.MedicosLista),
      },

      // Registrar médico
      {
        path: 'medicos/nuevo',
        loadComponent: () =>
          import('./features/medicos/medico-formulario/medico-formulario').then(
            (m) => m.MedicoFormulario,
          ),
      },

      // Editar médico
      {
        path: 'medicos/:id/editar',
        loadComponent: () =>
          import('./features/medicos/medico-formulario/medico-formulario').then(
            (m) => m.MedicoFormulario,
          ),
      },

      // Gestionar horarios de atención
      {
        path: 'medicos/:id/horarios',
        loadComponent: () =>
          import('./features/medicos/medico-horarios/medico-horarios').then(
            (m) => m.MedicoHorarios,
          ),
      },

      // Consultar médico
      {
        path: 'medicos/:id',
        loadComponent: () =>
          import('./features/medicos/medico-detalle/medico-detalle').then((m) => m.MedicoDetalle),
      },

      // ==========================================
      // GESTIÓN DE CITAS MÉDICAS
      // ==========================================

      // Listado de citas
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/citas/citas-lista/citas-lista').then((m) => m.CitasLista),
      },

      // Programar nueva cita
      {
        path: 'citas/nueva',
        loadComponent: () =>
          import('./features/citas/cita-formulario/cita-formulario').then((m) => m.CitaFormulario),
      },

      // Reprogramar cita
      {
        path: 'citas/:id/editar',
        loadComponent: () =>
          import('./features/citas/cita-formulario/cita-formulario').then((m) => m.CitaFormulario),
      },

      // Consultar cita
      {
        path: 'citas/:id',
        loadComponent: () =>
          import('./features/citas/cita-detalle/cita-detalle').then((m) => m.CitaDetalle),
      },

      // ==========================================
      // HISTORIAL CLÍNICO
      // ==========================================

      // Listado de historiales
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/historial/historial-lista/historial-lista').then(
            (m) => m.HistorialLista,
          ),
      },

      // Registrar atención médica
      {
        path: 'historial/:id/nueva-atencion',
        loadComponent: () =>
          import('./features/historial/atencion-formulario/atencion-formulario').then(
            (m) => m.AtencionFormulario,
          ),
      },

      // Consultar historial de un paciente
      {
        path: 'historial/:id',
        loadComponent: () =>
          import('./features/historial/historial-detalle/historial-detalle').then(
            (m) => m.HistorialDetalle,
          ),
      },

      // Consultar el detalle de una atención médica
      {
        path: 'historial/:id/atenciones/:atencionId',
        loadComponent: () =>
          import('./features/historial/atencion-detalle/atencion-detalle').then(
            (m) => m.AtencionDetalle,
          ),
      },

      // ==========================================
      // GESTIÓN DE USUARIOS
      // ==========================================
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios-lista/usuarios-lista').then((m) => m.UsuariosLista),
      },

      // ==========================================
      // FACTURACIÓN
      // ==========================================
      {
        path: 'facturacion',
        loadComponent: () =>
          import('./features/facturacion/facturas-lista/facturas-lista').then(
            (m) => m.FacturasLista,
          ),
      },
    ],
  },

  // ==========================================
  // RUTAS NO ENCONTRADAS
  // ==========================================
  {
    path: '**',
    redirectTo: 'login',
  },
];
