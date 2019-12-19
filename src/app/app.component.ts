import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "./file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Router,ActivatedRoute } from '@angular/router';

export interface Writer {
  writer_id : String;
  WinningProbability : DoubleRange;
  shareFlag : boolean;
  earning: number;
  myTales: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
 
  writers:any= [];
  shown: String = 'upload';
  constructor( 
    public fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ){ } 

  ngOnInit() {
     this.getwriterList();
   }

  

  getwriterList():void {
    this.fileUploadService.getwriterList()
        .subscribe((data  => {
          this.writers = data; 
          //console.log(data)
        }));
  }
   
  redirect(pagename: string) {
    console.log(pagename)
    this.shown = pagename;
    this.router.navigate(['/'+pagename]);
  }


}
