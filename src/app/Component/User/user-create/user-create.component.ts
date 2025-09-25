import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {

  createUserForm!: FormGroup;

  router= inject(Router);

  constructor(private fb:FormBuilder, private userService:UserServiceService) { }

  ngOnInit() {

    this.inItForm();

  }

  inItForm()
  {
    this.createUserForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(2)]],
      email: [''],
      password: ['1234']
    });
  }

  onSubmit(){
    this.userService.createUser(this.createUserForm.value).subscribe((data:any)=>{
      this.router.navigate(['/users']);
    })
  }
}
