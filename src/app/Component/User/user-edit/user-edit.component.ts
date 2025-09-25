import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  imports: [ ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent  implements OnInit{

  activatedoute = inject(ActivatedRoute);

  router = inject(Router);

  editUserForm!: FormGroup;

  userId: any;

  constructor(private userService: UserServiceService, private fb: FormBuilder) { }

  ngOnInit() {

    this.userId = this.activatedoute.snapshot.params['id'];

    this.fetchUser();

    this.inItForm();

  }

  inItForm(){
    this.editUserForm = this.fb.group({
      name: [''],
      email: ['']
    })
  }

  fetchUser(){
    this.userService.getUser(this.userId).subscribe((resposne)=>{

      this.editUserForm.patchValue(resposne.data);
    });
  }

  onSubmit(){
    this.userService.updateUser(this.userId, this.editUserForm.value).subscribe((response)=>{
      console.log(response);
      this.router.navigate(['/users']);
    });
  }

}
