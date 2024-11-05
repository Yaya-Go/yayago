import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PmService, IProject } from '../pm.service';
import { switchMap } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PmStatusComponent } from '../pm-status/pm-status.component';
import { PmTypeComponent } from '../pm-type/pm-type.component';
import { MatDialog } from '@angular/material/dialog';
import { PmAddComponent } from '../pm-add/pm-add.component';
import { PmNotesComponent } from '../pm-notes/pm-notes.component';

@Component({
  selector: 'app-pm-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    PmStatusComponent,
    PmTypeComponent,
    PmNotesComponent,
  ],
  templateUrl: './pm-detail.component.html',
  styleUrl: './pm-detail.component.scss',
})
export class PmDetailComponent {
  project: IProject;

  private readonly dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private pmService: PmService,
    private router: Router
  ) {
    this.route.params
      .pipe(switchMap((params) => this.pmService.getProject(params['id'])))
      .subscribe({
        next: (project) => {
          this.project = project;
        },
      });
  }

  editProject() {
    const dialogRef = this.dialog.open(PmAddComponent, {
      data: { project: this.project },
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: IProject) => {
      if (result) {
        if (result.id) {
          this.pmService.updateProject(result);
        } else {
          this.pmService.addProject(result);
        }
      }
    });
  }

  deleteProject() {
    if (
      confirm(
        `Are you sure you want to delete this project - ${this.project.name}?`
      )
    ) {
      if (this.project.id) {
        this.pmService.deleteProject(this.project.id).then(() => {
          this.router.navigate(['/project-management']);
        });
      }
    }
  }
}
