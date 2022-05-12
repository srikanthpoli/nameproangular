import { GlobalConstants } from './../common/global-constants';
import { User } from './../auth/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { analytics } from 'googleapis/build/src/apis/analytics';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private router: Router) { }

  login(userId: any, password: any) {
    let loggedInUser: any = { 'userId': 'none', 'password': 'none', 'roles': [] }
      let isLoggedIn = false;
    GlobalConstants.users.forEach(element => {
      if (element.userId === userId && element.password === password) {
        loggedInUser = element;
        isLoggedIn = true;

      }
    });

    const user = new User(loggedInUser.userId, loggedInUser.password, loggedInUser.roles);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    return user;

  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

  }

  autoLogin() {
    const userData: { userId: any, password: any, roles: any } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) { return; }
    const loadedUser = new User(userData.userId, userData.password, userData.roles);
    this.user.next(loadedUser);

  }



}
