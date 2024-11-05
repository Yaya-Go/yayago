import { effect, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '../../../../src/app/core/services/auth.service';
import { Observable } from 'rxjs';

export interface ITodo {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  done: boolean;
}

export interface ITodoItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  done: boolean;
  todoId: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly TODO = 'todo';
  private readonly ITEM = 'todo-item';
  private userId: string;

  private collections: CollectionReference<DocumentData>;
  private itemCollections: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.userId = this.auth.userData?.uid || '';
    this.collections = collection(this.firestore, this.TODO);
    this.itemCollections = collection(this.firestore, this.ITEM);
  }

  getTodos() {
    return collectionData(
      query(
        this.collections,
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      ),
      { idField: 'id' }
    ) as Observable<ITodo[]>;
  }

  getTodo(id: string) {
    const ref = doc(this.firestore, `${this.TODO}/${id}`);
    return docData(ref, { idField: 'id' });
  }

  createTodo(name: string) {
    const id = doc(collection(this.firestore, '_')).id;

    const newTodo: ITodo = {
      id,
      name,
      done: false,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    const ref = doc(this.firestore, `${this.TODO}/${id}`);

    return setDoc(ref, newTodo);
  }

  updateName(name: string, id: string) {
    const ref = doc(this.firestore, `${this.TODO}/${id}`);

    return setDoc(
      ref,
      { name, updatedAt: Date.now().toString() },
      { merge: true }
    );
  }

  updateStatus(id: string, status: boolean) {
    const ref = doc(this.firestore, `${this.TODO}/${id}`);
    return setDoc(
      ref,
      { done: status, updatedAt: Date.now().toString() },
      { merge: true }
    );
  }

  deleteTodo(id: string) {
    const ref = doc(this.firestore, `${this.TODO}/${id}`);
    return deleteDoc(ref);
  }

  getTodoItems(todoId: string) {
    return collectionData(
      query(
        this.itemCollections,
        where('todoId', '==', todoId),
        where('userId', '==', this.userId),
        orderBy('name', 'asc')
      ),
      { idField: 'id' }
    ) as Observable<ITodoItem[]>;
  }

  createItem(todoId: string, name: string) {
    const id = doc(collection(this.firestore, '_')).id;
    const newItem: ITodoItem = {
      id,
      name,
      done: false,
      todoId,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };
    const ref = doc(this.firestore, `${this.ITEM}/${id}`);
    return setDoc(ref, newItem);
  }

  updateItemName(name: string, id: string) {
    const ref = doc(this.firestore, `${this.ITEM}/${id}`);
    return setDoc(
      ref,
      { name, updatedAt: Date.now().toString() },
      { merge: true }
    );
  }

  updateItemStatus(id: string, status: boolean) {
    const ref = doc(this.firestore, `${this.ITEM}/${id}`);
    return setDoc(
      ref,
      { done: status, updatedAt: Date.now().toString() },
      { merge: true }
    );
  }

  deleteItem(id: string) {
    const ref = doc(this.firestore, `${this.ITEM}/${id}`);
    return deleteDoc(ref);
  }
}
