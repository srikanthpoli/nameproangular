import { GlobalConstants } from './../common/global-constants';
import { User } from './../auth/user.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { analytics } from 'googleapis/build/src/apis/analytics';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  GlobalConstants: any;
  
  constructor() { }

  login(userId:any,password:any) {
    let loggedInUser:any= {"userId":"none",password:"none"}
    
    this.GlobalConstants.users.forEach(element => {
      if(element.userId === userId && element.password === password) {
      loggedInUser = element;
      
      }
    });
    return loggedInUser;
    
  }
  
}
