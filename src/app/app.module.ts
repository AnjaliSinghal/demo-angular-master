import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PublishComponent } from './publish/publish.component';
import { AppRoutingModule } from './app-routing.module';
import { UploadComponent } from './upload/upload.component';
import { WriterComponent } from './writer/writer.component';

@NgModule({
  declarations: [
    AppComponent,
    PublishComponent,
    UploadComponent,
    WriterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
