import { Component, OnInit } from '@angular/core';
import { FileUploadService } from "../file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.css']
})
export class WriterComponent implements OnInit {

  writers:any= [];
  constructor( public fileUploadService: FileUploadService){} 

  ngOnInit() {
     this.getwriterList();
  }
  getwriterList():void {
    this.fileUploadService.getwriterList()
        .subscribe((data  => {
          this.writers = data; 
          console.log(data)
        }));
  }

}
