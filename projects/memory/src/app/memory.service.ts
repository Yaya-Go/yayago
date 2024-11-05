import { effect, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { AuthService } from '../../../../src/app/core/services/auth.service';
import { Observable } from 'rxjs';

export interface IMemory {
  id?: string;
  name: string;
  date: string;
  location?: string | string[];
  rate?: number;
  description?: string;
  backgroundImg?: string;
  schedules?: ISchedule[];
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

export interface ISchedule {
  id?: string;
  name: string;
  date: string;
  location?: string | string[];
  rate?: number;
  images?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
  memoryId: string;
}

@Injectable({ providedIn: 'root' })
export class MemoryService {
  private readonly MEMORY = 'memory';
  private readonly SCHEDULE = 'memory-schedule';
  private userId: string;
  private collections: CollectionReference<DocumentData>;
  private scheduleCollections: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
  ) {
    effect(() => {
      this.userId = this.auth.user$()?.uid || '';
    });
    this.collections = collection(this.firestore, this.MEMORY);
    this.scheduleCollections = collection(this.firestore, this.SCHEDULE);
  }

  getAll() {
    return collectionData(query(this.collections, where('userId', '==', this.userId), orderBy('createdAt', 'desc')), {
      idField: 'id',
    }) as Observable<IMemory[]>;
  }

  createMemory(memory: IMemory) {
    const id = doc(collection(this.firestore, '_')).id;

    const newMemory = {
      ...memory,
      id,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    const ref = doc(this.firestore, `${this.MEMORY}/${id}`);

    return setDoc(ref, newMemory);
  }

  getMemory(id: string) {
    const reference = doc(this.firestore, `${this.MEMORY}/${id}`);
    return docData(reference, { idField: 'id' });
  }

  updateMemory(memory: IMemory) {
    const reference = doc(this.firestore, `${this.MEMORY}/${memory.id}`);
    return updateDoc(reference, {
      ...memory,
      updatedAt: Date.now().toString(),
    });
  }

  deleteProject(id: string) {
    const reference = doc(this.firestore, `${this.MEMORY}/${id}`);
    return deleteDoc(reference);
  }

  getAllSchedules(memoryId: string) {
    return collectionData(
      query(
        this.scheduleCollections,
        where('memoryId', '==', memoryId),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
      ),
      { idField: 'id' },
    ) as Observable<ISchedule[]>;
  }

  createSchedule(schedule: ISchedule) {
    const id = doc(collection(this.firestore, '_')).id;
    const reference = doc(this.firestore, `${this.SCHEDULE}/${id}`);

    return setDoc(reference, {
      ...schedule,
      userId: this.userId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    });
  }

  updateSchedule(schedule: ISchedule) {
    const reference = doc(this.firestore, `${this.SCHEDULE}/${schedule.id}`);
    return updateDoc(reference, {
      ...schedule,
      updatedAt: Date.now().toString(),
    });
  }

  deleteSchedule(scheduleId: string) {
    const reference = doc(this.firestore, `${this.SCHEDULE}/${scheduleId}`);
    return deleteDoc(reference);
  }
}
