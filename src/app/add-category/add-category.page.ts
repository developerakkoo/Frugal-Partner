import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HandlerService } from '../handler.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {

  catForm!: FormGroup;
  file!: File;
  constructor(private http: HttpClient,
              private handler: HandlerService,
              private router: Router,
              private fb: FormBuilder) { 
                this.catForm = this.fb.group({
                  category:[, [Validators.required]],
                  model: [, [Validators.required]],
                  rate:[, [Validators.required]],
                  capacity: [, [Validators.required]],
                  monthlySubscription: [,[Validators.required]]
                })
              }

  ngOnInit() {
  }

  fileEvent(ev: any){
    console.log(ev.target.files[0]);
    this.file = ev.target.files[0];
    
  }

  onSubmit(){
    this.handler.presentLoading("Adding Category...");
    let formdata = new FormData();

    formdata.append("category", this.catForm.value.category);
    formdata.append("model", this.catForm.value.model);
    formdata.append("rate", this.catForm.value.rate);
    formdata.append("capcity", this.catForm.value.capacity);
    formdata.append("monthlySubscription", this.catForm.value.monthlySubscription);
    formdata.append("file",this.file, this.file.name);

    console.log(this.catForm.value);
    this.http.post(environment.URL + '/category', formdata)
    .subscribe({
      next:(value) =>{
        console.log(value);
        this.handler.dismissLoading();
        this.router.navigate(['home']);
      },
      error:(error) => {
        this.handler.dismissLoading();
        this.handler.presentAlert("Something went wrong!", "ERROR")
      },
      complete:() =>{
        console.log("Complete");
        
      }
    })
    

  }
}
