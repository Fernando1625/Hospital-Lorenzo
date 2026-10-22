import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  totalPacientes = 125;
  medicosActivos = 18;
  citasHoy = 24;
  citasPendientes = 9;

  proximasCitas = [
    {
      paciente: 'Ana Pérez',
      medico: 'Dr. Carlos López',
      hora: '09:00',
      estado: 'Confirmada',
    },
    {
      paciente: 'Luis Torres',
      medico: 'Dra. María Gómez',
      hora: '10:30',
      estado: 'Pendiente',
    },
  ];
}
