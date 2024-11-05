import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  appList = [
    {
      name: 'Todo List',
      routerLink: '/todo',
    },
    {
      name: 'Project Management',
      routerLink: '/project-management',
    },
    {
      name: 'Memory',
      routerLink: '/memory',
    },
  ];
}
