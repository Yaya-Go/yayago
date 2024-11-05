import { Component, inject, model, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IProjectNote } from '../pm.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pm-add-note',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './pm-add-note.component.html',
  styleUrl: './pm-add-note.component.scss',
})
export class PmAddNoteComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PmAddNoteComponent>);
  readonly data = inject<{ note: IProjectNote }>(MAT_DIALOG_DATA);
  readonly note = model(this.data?.note);

  noteForm: FormGroup;

  ngOnInit(): void {
    if (this.note()) {
      this.noteForm = new FormGroup({
        note: new FormControl(this.note().note),
      });
    } else {
      this.noteForm = new FormGroup({
        note: new FormControl(''),
      });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  addNote() {
    if (this.noteForm.invalid) return;

    let newNote: IProjectNote;
    if (this.note()) {
      newNote = {
        ...this.note(),
        note: this.noteForm.controls['note'].value,
      };
    } else {
      newNote = {
        note: this.noteForm.controls['note'].value,
      };
    }

    this.dialogRef.close(newNote);
  }
}
