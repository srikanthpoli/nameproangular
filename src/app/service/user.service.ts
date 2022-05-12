import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {GlobalConstants} from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  loadUserData(userid) {
    
    return this.http.get<any>(GlobalConstants.URL + 'employee/get/uid/' + userid)
    .pipe(map(res => res));
  }
  loadUsers() {
    return this.http.get<any>(GlobalConstants.URL + '/employee/list')
  }

  loadUsersBYSearch(text: string) {
    return this.http.get<any>(GlobalConstants.URL + '/employee/search/'+ text)
  }
}
