import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  standalone: true,
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})

export class Sidebar {}
