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
import { ITodo, ITodoItem, TodoService } from '../todo.service';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TodoDetailComponent>);
  readonly data = inject<{ todo: ITodo }>(MAT_DIALOG_DATA);
  readonly todo = model(this.data.todo);
  private readonly todoService = inject(TodoService);

  items$: Observable<ITodoItem[]>;

  ngOnInit(): void {
    this.items$ = this.todoService.getTodoItems(this.todo().id);
  }

  addItem() {
    const name = prompt('Enter your item name:');

    if (name) {
      this.todoService.createItem(this.todo().id, name);
    }
  }

  editItem(name: string, id: string) {
    const newName = prompt('Enter your new item name:', name);

    if (newName && newName !== name) {
      this.todoService.updateItemName(newName, id);
    }
  }

  update(status: boolean, id: string) {
    this.todoService.updateItemStatus(id, status);
  }

  deleteItem(name: string, id: string) {
    if (confirm(`Are you sure you want to delete ${name}`)) {
      this.todoService.deleteItem(id);
    }
  }
}
