import { AuthService } from './../service/auth.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from 'rxjs';
import { User } from './user.model';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginForm:FormGroup;
  constructor(private formBuilder:FormBuilder,private authService:AuthService){
    
  }
  user=new Subject<User>();
  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      userId:[''],
      password:['']
    }

    )
  }

  login() {
    
    this.authService.login(this.LoginForm.value.userId, this.LoginForm.value.password)
    .subscribe(res=> {
      this.user.next(res);
    })
  }
}