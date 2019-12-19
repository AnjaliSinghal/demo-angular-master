import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) { }

  upload( path: File): Observable<any> {
    var formData: any = new FormData();
    formData.append("path", path);
    return this.http.post('http://localhost:4000/api/uploadFile', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }
   
  getwriterList( ) {
    return this.http.get('http://localhost:4000/api/getwriterList').pipe(
      catchError(this.errorMgmt)
    )
  }

  getScheduling( ) {
    return this.http.get('http://localhost:4000/api/publishList').pipe(
      catchError(this.errorMgmt)
    )
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }


}
