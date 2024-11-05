import { Component, inject, OnInit } from '@angular/core';
import { IMemory, MemoryService } from '../memory.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-memory-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './memory-list.component.html',
  styleUrl: './memory-list.component.scss',
})
export class MemoryListComponent implements OnInit {
  list$: Observable<IMemory[]>;
  private readonly memoryService = inject(MemoryService);

  ngOnInit(): void {
    setTimeout(() => {
      this.list$ = this.memoryService.getAll();
    }, 300);
  }
}
