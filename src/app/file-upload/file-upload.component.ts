import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent {
  uploadFileForm: FormGroup

  selectedFile: File | null = null;
  message: string = '';
  files: any[] = []

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    ) {
      this.uploadFileForm = this.formBuilder.group({
        Key: [''],
      })
    }

  ngOnInit():void {
    this.userService.getFilesList()
    .subscribe((files: any) => {
      this.files = files;
      console.log("file-uploading files: " + files[0].Key);
    })
  }

  onSubmit() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name); // добавляем файл в FormData
  
    this.http.post('http://localhost:3000/upload', formData)
      .subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          this.router.navigate(['/file-upload']);
        },
        error => {
          console.error('Error uploading file:', error);
        }
      );
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0];
  }

  deleteFile(Key: string): void {
    if (confirm('Вы уверены, что хотите удалить файл?')) {
      this.userService.deleteFile(Key).subscribe(() => {
        this.userService.getFilesList().subscribe((files: any) => {
          this.files = files;
        });
      });
    }
  }
}
