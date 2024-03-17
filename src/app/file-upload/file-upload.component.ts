import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';

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

  ngOnInit() {
    this.userService.getFilesList()
      .subscribe(
        files => {
          this.userService.files = files;
        },
        error => {
          console.error('Failed to get files list.');
        }
      );
  }

  onSubmit() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      this.message = 'Please select a file.';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:3000/upload', formData).subscribe(
      response => {
        this.message = 'File uploaded successfully.';
      },
      error => {
        this.message = 'Failed to upload file.';
      }
    );
  }

  deleteFile(filename: string) {
    this.userService.deleteFile(filename).subscribe(
      response => {
        console.log('File deleted successfully.');
        this.userService.getFilesList().subscribe(
          files => {
            this.userService.files = files;
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
