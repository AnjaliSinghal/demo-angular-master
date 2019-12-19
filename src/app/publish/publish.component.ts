import { Component, OnInit } from '@angular/core';
import { FileUploadService } from "../file-upload.service";

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  tales:any= [];
  constructor( public fileUploadService: FileUploadService){} 

  ngOnInit() {
     this.getScheduling();
  }
  getScheduling():void {
    this.fileUploadService.getScheduling()
        .subscribe((data  => {
          this.tales = data; 
          console.log(data)
        }));
  }
}
