import { Component, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ITodo, ITodoItem, TodoService } from './todo.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  list$: Observable<ITodo[]>;
  private readonly todoService = inject(TodoService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.list$ = this.todoService.getTodos();
  }

  addTodo() {
    const name = prompt('What is your new todo name?');

    if (name) {
      this.todoService.createTodo(name);
    }
  }

  editTodo(name: string, id: string) {
    const newName = prompt('What is your new todo name?', name);

    if (newName && newName !== name) {
      this.todoService.updateName(newName, id);
    }
  }

  deleteTodo(name: string, id: string) {
    if (confirm(`Are you sure you want to delete ${name}`)) {
      this.todoService.deleteTodo(id);
    }
  }

  openDialog(todo: ITodo): void {
    const dialogRef = this.dialog.open(TodoDetailComponent, {
      data: { todo },
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: ITodoItem[]) => {
      if (result?.length > 0) {
        const allDone = result.find((res: ITodoItem) => !res.done);

        if (!allDone) {
          if (!todo.done) {
            this.todoService.updateStatus(todo.id, true);
          }
        } else {
          if (todo.done) {
            this.todoService.updateStatus(todo.id, false);
          }
        }
      }
    });
  }
}
