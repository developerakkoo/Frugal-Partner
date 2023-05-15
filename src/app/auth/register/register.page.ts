import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HandlerService } from 'src/app/handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form!: FormGroup;

  adharFile!:File;
  panFile!:File;

  rcFile!:File;
  licenseFile!:File;
  policeVerificationFile!:File;

  adharNo!: string;
  panNo!: string;
  gstNo!: string;
  vehiclesRow: any[] = [];


  postPartnerSub!:Subscription;
  constructor(private fb: FormBuilder,
              private handler: HandlerService,
              private http: HttpClient) {
                this.form = this.fb.group({
                  ownerMobile: [, [Validators.required, Validators.minLength(10)]],
                  name: [, [Validators.required]],
                  address: [, [Validators.required]],
               
                })
               }

  ngOnInit() {
  }

  ionViewDidLeave(){
    this.postPartnerSub.unsubscribe();
  }
  
 
  
  onAdharFileEvent(ev:any){
    console.log(ev.target.files[0]);

    this.adharFile = ev.target.files[0];
    
  }

  onPanFileEvent(ev:any){
    console.log(ev.target.files[0]);

    this.panFile = ev.target.files[0];
    
  }


  onAdharChange(ev:any){
    console.log(ev);
    this.adharNo = ev;
    
  }

  onGstChange(ev:any){
    console.log(ev);
    this.gstNo = ev;
  }

  onPanChange(ev:any){
    console.log(ev);
    this.panNo = ev;
  }




  onSubmit(){
    this.handler.presentLoading("Registering Partner...")
    let formdata = new FormData();
    formdata.append("name",this.form.value.name);
    formdata.append("MobileNumber", this.form.value.ownerMobile);
    formdata.append("Address", this.form.value.address);
    formdata.append("ADHARNumber", this.adharNo);
    formdata.append("PANNumber", this.panNo);
    formdata.append("GSTNumber", this.gstNo);
    formdata.append("PANCard",this.panFile, this.panFile.name);
    formdata.append("ADHARCard",this.adharFile, this.adharFile.name);

    this.postPartnerSub = this.http.post(environment.URL +`/App/api/v1/Vowner`, formdata)
    .subscribe({
      next:(value) =>{
        console.log(value);
        this.handler.dismissLoading();
        
      },
      error:(error) =>{
        console.log(error);
        this.handler.dismissLoading();
        
      },
      complete:() =>{
        console.log("REgister Complete");
        this.handler.dismissLoading();
        
      }
    })
    
  }

}
