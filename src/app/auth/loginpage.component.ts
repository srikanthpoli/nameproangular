import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginForm:FormGroup;
  constructor(private formBuilder:FormBuilder){
    
  }
  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      userId:[''],
      password:['']
    }

    )
  }
}