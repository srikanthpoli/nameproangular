import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {GlobalConstants} from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  loadUserData(userId) {
    return this.http.get<any>(GlobalConstants.URL + '/employee/get/uid/' + userId)
    .pipe(map(res => res));
  }
  loadUsers() {
    return this.http.get<any>(GlobalConstants.URL + '/employee/list')
    .pipe(map(res => res));
  }
}
