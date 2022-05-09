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
  user=new BehaviorSubject<User>(null);
   
  constructor(private router:Router) { }

  login(userId:any,password:any) {
    let loggedInUser:any= {"userId":"none","password":"none","roles":[]}
    
    GlobalConstants.users.forEach(element => {
      if(element.userId === userId && element.password === password) {
      loggedInUser = element;
      
      }
    });
   
    const user = new User(loggedInUser.userId,loggedInUser.password,loggedInUser.roles);
    this.user.next(user);
    return loggedInUser;
    
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth'])
    
  }
  
}
