import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "../file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  form: FormGroup;
  progress: number = 0;

  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService,
    private router: Router
  ) {
    this.form = this.fb.group({
      path: [null]
    })
  }

  ngOnInit() { }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      path: file
    });
    this.form.get('path').updateValueAndValidity()
  }

  submitUser() {
    this.fileUploadService.upload(
      this.form.value.path
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('File successfully upload!', event.body);
          this.router.navigate(['/writers']);
          setTimeout(() => {
            this.progress = 0;
          }, 1500);

      }
    })
  }

}
