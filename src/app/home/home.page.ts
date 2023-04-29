import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandlerService } from '../handler.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  categories: any[] = [];

  getCatSub!: Subscription;
  deleteCatSub!: Subscription;
  constructor(private http: HttpClient,
    private handler: HandlerService,
    private router: Router) {

  };

  ionViewDidEnter() {
    console.log("Page Enter");
    
    this.getAllCategories();
  }

  ionViewDidLeave() {
    console.log("Page Leave");
    
    this.getCatSub.unsubscribe();
    this.deleteCatSub.unsubscribe();
  }
  getAllCategories() {
    this.handler.presentLoading("Loading...");
    this.getCatSub = this.http.get(environment.URL + '/category')
      .subscribe({
        next: (cat: any) => {
          console.log(cat);
          this.categories = cat['cat'];
          this.handler.dismissLoading();

        },
        error: (error: any) => {
          console.log(error);
          this.handler.dismissLoading();

          this.handler.presentToast(error.message)

        },


        complete: () => {
          console.log("Cat Complete");
          this.handler.dismissLoading();


        }
      })
  }

  delete(id:string){
    console.log(id);
    this.handler.presentLoading("Deleting...")
    this.deleteCatSub = this.http.delete(environment.URL +'/category/'+ id)
    .subscribe({
      next:(value) => {
        console.log(value);
        this.handler.dismissLoading();
        this.getAllCategories();
        
      },
      error:(error) =>{
        this.handler.dismissLoading();
        this.handler.presentAlert("Error Deleting Category", "ERROr");
      }
    })
  }

  openPage(name:string){
    this.router.navigate([name]);
  }

}
