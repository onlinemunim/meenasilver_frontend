import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirmService } from '../../Services/firm.service';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-test-file-upload',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './test-file-upload.component.html',
  styleUrl: './test-file-upload.component.css'
})
export class TestFileUploadComponent implements OnInit {

  fileUploadForm!: FormGroup;
  selectedFile!: File;
  imagePath!: string;

  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fileUploadForm = this.fb.group({
      name: [''],
      email: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Update the form control value

      this.fileUploadForm.patchValue({ file: this.selectedFile });

    }
  }

  onSubmit() {

    let formData = new FormData();

    Object.entries(this.fileUploadForm.value).forEach(([key, value]) => {

      formData.append(key, value as string);

    });


    formData.append('profile', this.selectedFile);

    this.firmService.testFileUpload(formData).subscribe({
      next: (res: any) => {
        console.log('Upload success:', res);

        this.imagePath = res.path;

        this.fileUploadForm.reset();

        this.selectedFile = undefined as any; // Reset the selected file

      },
      error: (err) => {
        console.error('Upload error:', err);
      }
    });
  }



  // onSubmit() {

  //   const formData = new FormData();

  //   formData.append('name', this.fileUploadForm.get('name')?.value);

  //   formData.append('email', this.fileUploadForm.get('email')?.value);

  //   formData.append('profile', this.selectedFile);

  //     this.http.post('http://localhost:9000/api/image-upload', formData).subscribe({
  //       next: (res:any ) =>{
  //         console.log('Upload success:', res);

  //         this.imagePath = res.path; // Assuming the response contains the image path
  //       }
  //     });
  // }
}
