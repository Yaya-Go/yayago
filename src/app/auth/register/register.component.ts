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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      displayName: new FormControl('', [Validators.required]),
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.SignUp(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.displayName
      );
    }
  }

  updateErrorMessage(control: string) {
    if (this.registerForm.controls[control].hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.registerForm.controls[control].hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else if (this.registerForm.controls[control].hasError('minLength')) {
      this.errorMessage.set('Min length is 6');
    } else {
      this.errorMessage.set('');
    }
  }
}
