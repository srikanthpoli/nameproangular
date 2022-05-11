import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {GlobalConstants} from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return this.http.get<any>(GlobalConstants.URL + 'get/uid/' + userData.userId)
    .pipe(map(res => res));
  }
}
