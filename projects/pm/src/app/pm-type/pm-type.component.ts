import { Component, Input } from '@angular/core';
import { PROJECT_TYPE } from '../pm.service';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pm-type',
  standalone: true,
  imports: [MatIconModule, TitleCasePipe],
  templateUrl: './pm-type.component.html',
  styleUrl: './pm-type.component.scss',
})
export class PmTypeComponent {
  @Input() type: PROJECT_TYPE;
  pmType = PROJECT_TYPE;
}
