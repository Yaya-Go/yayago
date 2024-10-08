import { Component, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doc-header',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user: User | null;

  constructor(private auth: AuthService) {
    effect(
      () => {
        this.user = this.auth.user$();
      },
      { allowSignalWrites: true }
    );
  }

  signout() {
    this.auth.SignOut();
  }
}
