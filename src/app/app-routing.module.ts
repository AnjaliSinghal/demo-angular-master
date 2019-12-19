import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublishComponent } from './publish/publish.component';
import { UploadComponent } from './upload/upload.component';
import { WriterComponent } from './writer/writer.component';

const routes: Routes = [
  { path: '',   redirectTo: '/upload', pathMatch: 'full' },
  { path: 'writers' , component: WriterComponent },
  { path: 'scheduling', component: PublishComponent },
  { path: 'upload', component: UploadComponent }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
