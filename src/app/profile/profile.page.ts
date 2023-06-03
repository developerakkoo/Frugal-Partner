import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HandlerService } from '../handler.service';
import { Subscription, identity } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GoogleMapsPage } from '../google-maps/google-maps.page';
declare var Razorpay: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  form!: FormGroup;

  partnerId:any;

  isEditable!:boolean ;
  isReqSentForEditEnable!:boolean;

  vehiclesRow: any[] = [];
  vehiclesRowNotActive:any[] = [];
  categoryList: any[] = [];
  rcFile!:File;
  licenseFile!:File;
  policeVerificationFile!:File;

  isProfileView: boolean = false;
  isVehicleView: boolean = false;

  getVehicleSub!: Subscription;
  getProfileSub!: Subscription;
  getCategorySub!: Subscription;
  deleteVehicleSub!: Subscription;
  updateVehicleOwnerSub!: Subscription;
  createOrderSub!: Subscription;

  segmentName: string = "profile";

  OwnerRate!:string;
  Category!:string;
  Capacity!:string;
  MobileNumber!: string;
  VehicleNumber!:string;
  ModelType!: string;
  Rates!: string;
  subscriptionEndsOn!: string;
  DriverName!: string;
  License!: string;
  Pan!: string;


  constructor(private http: HttpClient,
              private handler: HandlerService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private modalController: ModalController,
    private loadingController: LoadingController,
              private alertController: AlertController
              ) {
                this.form = this.fb.group({
                  mobile: [],
                  name:[],
                  address:[],
                  gst:[],
                  pan:[],
                  adhar:[]
                })

                this.partnerId = this.route.snapshot.paramMap.get("id");
                this.getPartnerProfile();
                this.isProfileView = true;
               }

  ngOnInit() {
  }

  ionViewDidLeave(){
    this.getVehicleSub.unsubscribe();
    this.getProfileSub.unsubscribe();
    this.getCategorySub.unsubscribe();
  }

  getPartnerProfile(){
    this.getProfileSub =  this.http.get(environment.URL +`/App/api/v1/getById/owners/${this.partnerId}`)
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.form.get("name")?.setValue(value['Vowner'][0]['name']);
        this.form.get("mobile")?.setValue(value['Vowner'][0]['MobileNumber']);
        this.form.get("address")?.setValue(value['Vowner'][0]['Address']);
        this.form.get("gst")?.setValue(value['Vowner'][0]['GSTNumber']);
        this.form.get("pan")?.setValue(value['Vowner'][0]['PANNumber']);
        this.form.get("adhar")?.setValue(value['Vowner'][0]['ADHARNumber']);
        this.License = value['Vowner'][0]['ADHARCard']
        this.Pan = value['Vowner'][0]['PANCard'];
        this.isEditable = value['Vowner'][0]['isEditEnable'];
        this.isReqSentForEditEnable = value['Vowner'][0]['isReqSentForEditEnable'];

        
      },
      error:(error) =>{
        console.log(error);
        
      },
      complete:() =>{
        console.log("Get Profile Complete");
        
      }
    })
  }

  getPartnerVehiclesActive(){
    this.getVehicleSub =  this.http.get(environment.URL +`/getVehiclesByMonthlyActiveSubscription/vehicle/${this.partnerId}`)
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.vehiclesRow = value['availableVehicles'];
        this.getPartnerVehiclesNotActive();
        
      },
      error:(error) =>{
        console.log(error);

        
        
      },
      complete:() =>{
        console.log("Get Profile Complete");
        
        
      }
    })
  }

  getPartnerVehiclesNotActive(){
    this.getVehicleSub =  this.http.get(environment.URL +`/getVehiclesByMonthlyNotActiveSubscription/vehicle/${this.partnerId}`)
    .subscribe({
      next:(value:any) =>{
        console.log("Not ACTIVE VEHICLES");
        
        console.log(value);
        this.vehiclesRowNotActive = value['availableVehicles'];
        
      },
      error:(error) =>{
        console.log(error);

        
        
      },
      complete:() =>{
        console.log("Get Profile Complete");
        
        
      }
    })
  }

  RequestAdminForEdit(){
    this.presentLoading();
    this.http.put(environment.URL+ `/owner/SentForEditEnable`,{id: this.partnerId})
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.loadingController.dismiss();
        this.getPartnerProfile();
      },
      error:(error) =>{
        console.log(error);
        this.loadingController.dismiss();
      }
    })
  }

  getCategory(){
    this.getCategorySub = this.http.get(environment.URL +'/category')
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.categoryList = value['cat'];
      },
      error:(error) =>{
        console.log(error);
        
      }
    })
  }


  categorySelectEvent(ev:any, vehiceId:any){
    console.log(ev.detail.value);
    this.http.get(environment.URL +`/category/${ev.detail.value}`)
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.Category = value['cat']['category'];
        this.Capacity = value['cat']['capacity'];
        this.ModelType = value['cat']['model'];
        this.Rates = value['cat']['rate'];
        this.updateVehicle(vehiceId);
      },
      error:(error) =>{
        console.log(error);
        
      }
    })
    
  }

  updateVehicleOwnerRate(id:any, rate:any){
    console.log(rate);
    
    this.http.put(environment.URL+ `/App/api/v1/updateVehicle/admin/${id}`, {
      ownerRate: this.OwnerRate,
      Capacity: this.Capacity,
      Category: this.Category,
      modelType: this.ModelType,
      Rate: this.Rates,
    }).subscribe({
      next:(value:any) =>{
        console.log(value);
        this.getPartnerVehiclesActive();
      },
      error:(error: any)=>{
        console.log(error);
        
      },
      complete:() =>{
        console.log("Update complete");
        
      }
    })
  }

  updateVehicle(id:any){
    console.log(identity);
    
    this.http.put(environment.URL+ `/App/api/v1/updateVehicle/admin/${id}`, {
      Capacity: this.Capacity,
      Category: this.Category,
      modelType: this.ModelType,
      Rate: this.Rates,
    }).subscribe({
      next:(value:any) =>{
        console.log(value);
        this.getPartnerVehiclesActive();
      },
      error:(error: any)=>{
        console.log(error);
        
      },
      complete:() =>{
        console.log("Update complete");
        
      }
    })
  }

  async presentModal(driverId:string) {
    const modal = await this.modalController.create({
    component: GoogleMapsPage,
    backdropDismiss: false,
    componentProps: { value: driverId }
    });
  
    await modal.present();
  
  }

  openGoogleMapsModel(id:any){
    console.log(id);
    this.presentModal(id);
    
  }
  segmentChanged(ev:any){
    console.log(ev);
    if(ev.detail.value == "profile"){
      this.isProfileView = true;
      this.isVehicleView = false;
      this.getPartnerProfile();
    }
    else if(ev.detail.value == "vehicles"){
      this.isProfileView = false;
      this.isVehicleView = true;
      this.getPartnerVehiclesActive();
      this.getCategory();
    }
    
  }
  addVehicleRow(){
    this.vehiclesRow.push({
      item:1
    })
  }

  removeVehicleRow(){
    this.vehiclesRow.pop();
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
  purchaseSubscription(item:number, id:string){
    console.log(item);
    this.Checkout(item, id);
    
  }
  addVehicles(){
    this.router.navigate(['add-vehicle', this.partnerId]);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
  }
  onSubmit(){
    this.presentLoading();
    let body = {
      name: this.form.value.name,
      MobileNumber: this.form.value.mobile,
      Address: this.form.value.address,
      GSTNumber: this.form.value.gst,
      PANNumber: this.form.value.pan,
      ADHARNumber: this.form.value.adhar,
      isEditEnable: false
    }
    this.updateVehicleOwnerSub = this.http.put(environment.URL+ `/App/api/v1/Update/owners/${this.partnerId}`, body)
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        this.loadingController.dismiss();
        this.handler.presentToast("Profile Updated Successfully!")

        this.getPartnerProfile();
      },
      error:(error) =>{
        console.log(error);
        this.loadingController.dismiss();
        
        this.handler.presentToast("Error Updating.")
      }
    })
  }


  Checkout(amount:number, id:any) {

    console.log(`Payment of rs${amount}`);
    console.log(`Payment of rs${amount * 100}`);
    let order = {
      amount: (amount) * 100
    }

    // this.haptics.hapticsImpactMedium();
    this.createOrderSub = this.http.post(environment.URL + '/App/api/v1/payment', order)
      .subscribe((order:any) => {
        console.log(order);
       let orderId = order['orderId'];
          var options = {
            "key": "rzp_test_NZPT7cTtpJaWr2", // Enter the Key ID generated from the Dashboard
            "amount": order['order']['amount'], // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Consign",
            "description": "Amount to be paid",
            // "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": (response:any) => {
              console.log("Payment Success");

              this.subscriptionSuccess(id)
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature)
            },

            "theme": {
              "color": "#21AD4B"
            }
          };

          this.initPay(options);

        

      })


  }


  async presentAlertConfirm(id:string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you confirm to Remove Driver?!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.handler.dismissLoading()
;            this.deleteVehicleSub = this.http.delete(environment.URL + `/App/api/v1/Delete/vehicle/${id}`)
            .subscribe({
              next:(value:any) =>{
                console.log(value);
                this.handler.presentToast("Driver Removed Successfully");
                this.handler.dismissLoading();
                this.getPartnerVehiclesActive();
        this.getPartnerVehiclesNotActive();

                
              },
              error:(error) =>{
                console.log(error);
                this.handler.dismissLoading();
                this.handler.presentToast("Error Removing Driver!");
                
              }
            })
          }
        }
      ]
    });
  
    await alert.present();
  }
  deleteVehicle(id:string){
    console.log(id);
    this.presentAlertConfirm(id);
    
  }

  subscriptionSuccess(id:any){
    this.http.put(environment.URL + `/App/api/v1/getSubscription`, {
      id: id
    }).subscribe({
      next:(value:any) =>{
        console.log(value);
        this.getPartnerVehiclesActive();
        this.getPartnerVehiclesNotActive();

      },
      error:(error:any) =>{
        console.log(error);
        
      },
      complete:() =>{
        console.log("complete");
        
      }
    })
  }
  initPay(options:any) {
    var rz = new Razorpay(options);
    rz.on('payment.failed', function (response:any) {
      console.log("Payment FAiled");

      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });

    rz.open();
  }


}
