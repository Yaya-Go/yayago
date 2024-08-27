import { Injectable, Optional, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateCurrentUser,
  updateProfile,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState;
  userData = signal<User | null>(null);

  constructor(
    public firestore: Firestore,
    public router: Router,
    @Optional() private auth: Auth
  ) {
    if (auth) {
      this.authState = authState(this.auth);

      this.authState.subscribe((user: any) => {
        if (user) {
          this.userData.set(user);
          localStorage.setItem('user', JSON.stringify(this.userData()));
          JSON.parse(localStorage.getItem('user')!);
        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      });
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== 'null' && user !== null;
  }

  get isVerify(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user && user.emailVerified !== false;
  }

  SignIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.authState.subscribe((user: any) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((err) => {
        window.alert(err.message);
      });
  }

  SignUp(email: string, password: string, displayName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData({ ...result.user, displayName });
        return result;
      })
      .then((result) => {
        updateProfile(result.user, { displayName });
      })
      .catch((err) => {
        window.alert(err.message);
      });
  }

  SendVerificationMail() {
    if (this.auth.currentUser) {
      sendEmailVerification(this.auth.currentUser).then(() =>
        this.router.navigate(['verify-email'])
      );
    }
  }

  ForgotPassword(passwordResetEmail: string) {
    sendPasswordResetEmail(this.auth, passwordResetEmail)
      .then(() => window.alert('Password reset email sent, check your inbox.'))
      .catch((err) => window.alert(err));
  }

  async SetUserData(user: any) {
    const userRef = doc(this.firestore, `users/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    await setDoc(userRef, userData);
  }

  SignOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
