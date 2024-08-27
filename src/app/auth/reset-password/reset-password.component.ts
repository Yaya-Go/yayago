import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.createFrom();
  }

  createFrom() {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  reset() {
    if (this.resetForm.valid) {
      this.authService.ForgotPassword(this.resetForm.value.email);
    }
  }

  updateErrorMessage() {
    if (this.resetForm.controls['email'].hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.resetForm.controls['emal'].hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}
