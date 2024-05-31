import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  mykeyword: string='.';
  data: any;
  // articles: any;
  articles: any[] = [];
  searchForm: FormGroup

  constructor(  
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
    })
  }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.http.get<any>('http://localhost:3000/api/news/news/a').subscribe(
      (data) => {
        this.articles = data.articles || [];
        console.log('Articles:', this.articles); // Проверьте данные в консоли
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onSubmit(): void {
    const keyword = this.searchForm.get('keyword')?.value;
    if (keyword) {
      this.http.get<any>(`http://localhost:3000/api/news/news/${keyword}`).subscribe(
        (data) => {
          this.articles = data.articles || [];
          console.log('Articles:', this.articles); // Проверьте данные в консоли
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  trackByFn(index: number, article: any): any {
    return article.id; // Или другое уникальное поле, по которому можно идентифицировать элемент
  }

  
  logout(): void{
    this.userService.logout();
  }

  isUserAuth(): boolean{
    return this.userService.isUserAuth();
  }

  getCurrentUserId(): string{
    return this.userService.getCurrentUserId();
  }
}
