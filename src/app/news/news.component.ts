import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  myCity: string='.';
  data: any;
  // articles: any;
  articles: any;
  searchForm: FormGroup

  constructor(  
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.searchForm = this.formBuilder.group({
      city: [''],
    })
  }
  ngOnInit(): void {
    console.log("on init")
    this.route.paramMap.subscribe(params => {
      const searchCity = params.get('city'); 

    if (searchCity){
      this.myCity = searchCity;
    }
    console.log("city = " + searchCity + " = " + this.myCity)

    this.userService.getNews(this.myCity).subscribe(data => {
      this.articles = data;
      // console.log("My Data = " + data);
      // console.log('Weather Data:', this.weatherData);
    }, error => {
      console.error('Error fetching data:', error);
    });
    })
  }

  onSubmit(): void {
    if (this.searchForm.valid){
      console.log("on submit");
      this.myCity = this.searchForm.value.city;
      this.userService.getNews(this.myCity).subscribe(
        data => {
          console.log('User added successfully:', data);//данные не приходят
        },
        error => {
          console.error('Error adding user:', error);//=>срабатывает ошибка
          this.router.navigate(['/error']);
        }
      );
      this.router.navigate(['/news/' + this.myCity]);

    }
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
