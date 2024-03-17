import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent {

  message: string = '';
  files: any[] = []

  constructor(
    private http: HttpClient,
    private userService: UserService,
    ) {}

  ngOnInit():void {
    this.userService.getFilesList()
    .subscribe((files: any) => {
      this.files = files;
      // console.log("file-uploading files: " + files[0].filename);
    })
  }

  onSubmit() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      this.message = 'Please select a file.';
      console.log("no file")
      return;
    }
    else{
      console.log("file = " + file)
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:3000/upload', formData).pipe(
      catchError(
        error => {
          console.error(error.error.message);
          return throwError(error.error.message);
        }),
      tap(response => {
        // Дополнительная проверка на успешное выполнение запроса
        
        if (response.success) {
          // Действия при успешном выполнении
          console.log('User added successfully');
        }
      })
    );
    // .subscribe(
    //   response => {
    //     this.message = 'File uploaded successfully.';
    //   },
    //   error => {
    //     this.message = 'Failed to upload file.';
    //   }
    // );
  }

  deleteFile(filename: string): void {
    this.userService.deleteFile(filename).subscribe(
      response => {
        console.log('File deleted successfully.');
        this.userService.getFilesList().subscribe(
          files => {
            this.files = files;
          },
          error => {
            console.error('Failed to get files list.');
          }
        );
      },
      error => {
        console.error('Failed to delete file.');
      }
    );
  }

}
