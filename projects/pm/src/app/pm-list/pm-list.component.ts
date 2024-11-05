import { Component, inject, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  PmService,
  IProject,
  PROJECT_STATUS,
  PROJECT_TYPE,
} from '../pm.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PmAddComponent } from '../pm-add/pm-add.component';
import { RouterModule } from '@angular/router';
import { PmTypeComponent } from '../pm-type/pm-type.component';
import { PmStatusComponent } from '../pm-status/pm-status.component';

@Component({
  selector: 'app-pm-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PmTypeComponent,
    PmStatusComponent,
  ],
  templateUrl: './pm-list.component.html',
  styleUrl: './pm-list.component.scss',
})
export class PmListComponent implements OnInit {
  list$: Observable<IProject[]>;
  private readonly pmService = inject(PmService);
  private readonly dialog = inject(MatDialog);

  pmType = PROJECT_TYPE;
  pmStatus = PROJECT_STATUS;

  ngOnInit(): void {
    setTimeout(() => {
      this.list$ = this.pmService.getAll();
    }, 200);
  }

  addProject() {
    const dialogRef = this.dialog.open(PmAddComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe({
      next: (project) => {
        if (project) {
          this.pmService.addProject(project);
        }
      },
    });
  }

  deleteProject(name: string, id: string) {
    if (confirm(`Are you sure you want to delete ${name}`)) {
      this.pmService.deleteProject(id);
    }
  }
}
