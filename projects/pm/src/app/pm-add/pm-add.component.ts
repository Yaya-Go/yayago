import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Project, PROJECT_STATUS, PROJECT_TYPE } from '../pm.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-pm-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './pm-add.component.html',
  styleUrl: './pm-add.component.scss',
})
export class PmAddComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PmAddComponent>);
  readonly data = inject<{ project: Project }>(MAT_DIALOG_DATA);
  readonly project = model(this.data?.project);

  pmForm: FormGroup;
  pmType = PROJECT_TYPE;
  pmStatus = PROJECT_STATUS;

  ngOnInit(): void {
    if (this.project()) {
      this.pmForm = new FormGroup({
        name: new FormControl(this.project().name, Validators.required),
        caseNumber: new FormControl(
          this.project().caseNumber,
          Validators.required
        ),
        type: new FormControl(this.project().type, Validators.required),
        status: new FormControl(this.project().status, Validators.required),
      });
    } else {
      this.pmForm = new FormGroup({
        name: new FormControl('', Validators.required),
        caseNumber: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
      });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  addProject() {
    if (this.pmForm.invalid) return;

    let newProject: Project;
    if (this.project()) {
      newProject = {
        ...this.project(),
        name: this.pmForm.controls['name'].value,
        caseNumber: this.pmForm.controls['caseNumber'].value,
        type: this.pmForm.controls['type'].value,
        status: this.pmForm.controls['status'].value,
      };
    } else {
      newProject = {
        name: this.pmForm.controls['name'].value,
        caseNumber: this.pmForm.controls['caseNumber'].value,
        type: this.pmForm.controls['type'].value,
        status: this.pmForm.controls['status'].value,
      };
    }

    this.dialogRef.close(newProject);
  }
}
