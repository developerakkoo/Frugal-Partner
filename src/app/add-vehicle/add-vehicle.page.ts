import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HandlerService } from '../handler.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {

  partnerId:any;

  path:string = ""
  rcFile!:File;
  licenseFile!:File;
  policeVerificationFile!:File;

  Category!:string;
  MobileNumber!: string;
  VehicleNumber!:string;
  ModelType!: string;
  Rates!: string;
  subscriptionEndsOn!: string;
  DriverName!: string;

  postVehicleSub!: Subscription;
  constructor(private http: HttpClient,
    private handler: HandlerService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
      this.partnerId = this.route.snapshot.paramMap.get('id');
      this.path = `/profile/${this.partnerId}`;
     }

  ngOnInit() {
  }


  ionViewDidLeave(){
    this.postVehicleSub.unsubscribe();
  }

  onRcFileEvent(ev:any){
    console.log(ev.target.files[0]);
    this.rcFile = ev.target.files[0]
  }

  onLicenseFileEvent(ev:any){
    console.log(ev.target.files[0]);
    this.licenseFile = ev.target.files[0];
  }
  onPoliceVerificationFileEvent(ev:any){
    console.log(ev.target.files[0]);

    this.policeVerificationFile = ev.target.files[0];
    
  }
  purchaseSubscription(item:any){
    console.log(item);
    
  }

  add(){
    this.handler.presentLoading("Adding Vehicle...")
      let formdata = new FormData();
      formdata.append("Category",this.Category)
      formdata.append("VehiclesOwnerId",this.partnerId)
      formdata.append("MobileNumber",this.MobileNumber)
      formdata.append("VehicleNumber",this.VehicleNumber)
      formdata.append("DriverName",this.DriverName)
      formdata.append("RC", this.rcFile, this.rcFile.name)
      formdata.append("License", this.licenseFile, this.licenseFile.name)
      formdata.append("PoliceVerification", this.policeVerificationFile, this.policeVerificationFile.name)

      this.postVehicleSub = this.http.post(environment.URL + `/App/api/v1/vehicle`, formdata)
      .subscribe({
        next:(value:any) =>{
          console.log(value);
          this.handler.dismissLoading();          
          this.handler.presentToast("Vehicle Added Successfully!")
        },
        error:(error) =>{
          console.log(error);
          this.handler.dismissLoading();          
        }
      })
  } 

}
