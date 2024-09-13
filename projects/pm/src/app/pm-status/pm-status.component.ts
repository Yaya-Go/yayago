import { Component, Input } from '@angular/core';
import { PROJECT_STATUS } from '../pm.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pm-status',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './pm-status.component.html',
  styleUrl: './pm-status.component.scss',
})
export class PmStatusComponent {
  @Input() status: PROJECT_STATUS;
  pmStatus = PROJECT_STATUS;
}
