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
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '../../../../src/app/core/services/auth.service';
import { Observable } from 'rxjs';

export interface IProject {
  id?: string;
  name: string;
  caseNumber: string;
  status: PROJECT_STATUS;
  type: PROJECT_TYPE;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export enum PROJECT_TYPE {
  IMPORT = 'import',
  EXPORT = 'export',
  WEBSERVICE = 'webservice',
}

export enum PROJECT_STATUS {
  TODO = 'todo',
  INPROCESS = 'in process',
  TESTING = 'testing',
  INPROD = 'in production',
  COMPLETE = 'complete',
}

export interface IProjectNote {
  id?: string;
  note: string;
  done?: boolean;
  createdAt?: string;
  updatedAt?: string;
  projectId?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PmService {
  private readonly PM = 'projects';
  private readonly NOTES = 'project-notes';
  private userId: string;
  private collections: CollectionReference<DocumentData>;
  private notesCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
  ) {
    effect(() => {
      this.userId = this.auth.user$()?.uid || '';
    });
    this.collections = collection(this.firestore, this.PM);
    this.notesCollection = collection(this.firestore, this.NOTES);
  }

  getAll() {
    return collectionData(query(this.collections, where('userId', '==', this.userId), orderBy('createdAt', 'desc')), {
      idField: 'id',
    }) as Observable<IProject[]>;
  }

  addProject(project: IProject) {
    const id = doc(collection(this.firestore, '_')).id;

    const newProject = {
      ...project,
      id,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    const ref = doc(this.firestore, `${this.PM}/${id}`);

    return setDoc(ref, newProject);
  }

  getProject(id: string) {
    const reference = doc(this.firestore, `${this.PM}/${id}`);
    return docData(reference, { idField: 'id' });
  }

  updateProject(project: IProject) {
    const reference = doc(this.firestore, `${this.PM}/${project.id}`);
    return updateDoc(reference, {
      ...project,
      updatedAt: Date.now().toString(),
    });
  }

  deleteProject(id: string) {
    const reference = doc(this.firestore, `${this.PM}/${id}`);
    return deleteDoc(reference);
  }

  getNotes(projectId: string) {
    return collectionData(
      query(
        this.notesCollection,
        where('projectId', '==', projectId),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
      ),
      { idField: 'id' },
    ) as Observable<IProjectNote[]>;
  }

  addNote(projectId: string, note: string) {
    const id = doc(collection(this.firestore, '_')).id;
    const reference = doc(this.firestore, `${this.NOTES}/${id}`);

    return setDoc(reference, {
      note,
      done: false,
      projectId,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    });
  }

  updateNote(note: IProjectNote) {
    const reference = doc(this.firestore, `${this.NOTES}/${note.id}`);
    return updateDoc(reference, {
      ...note,
      updatedAt: Date.now().toString(),
    });
  }

  deleteNote(note: IProjectNote) {
    const reference = doc(this.firestore, `${this.NOTES}/${note.id}`);
    return deleteDoc(reference);
  }
}
