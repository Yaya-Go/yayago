import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProjectNote, PmService } from '../pm.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PmAddNoteComponent } from '../pm-add-note/pm-add-note.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-pm-notes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './pm-notes.component.html',
  styleUrl: './pm-notes.component.scss',
})
export class PmNotesComponent implements OnInit {
  @Input() projectId!: string;
  notes$: Observable<IProjectNote[]>;

  private readonly dialog = inject(MatDialog);

  constructor(private pmService: PmService) {}

  ngOnInit() {
    this.notes$ = this.pmService.getNotes(this.projectId);
  }

  addNote(note?: IProjectNote) {
    const dialogRef = this.dialog.open(PmAddNoteComponent, {
      width: '600px',
      disableClose: true,
      data: { note },
    });

    dialogRef.afterClosed().subscribe((result: IProjectNote) => {
      if (result) {
        if (result.id) {
          this.pmService.updateNote(result);
        } else {
          this.pmService.addNote(this.projectId, result.note);
        }
      }
    });
  }

  makeDone(note: IProjectNote) {
    this.pmService.updateNote({ ...note, done: !note.done });
  }

  deleteNote(note: IProjectNote) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.pmService.deleteNote(note);
    }
  }
}
