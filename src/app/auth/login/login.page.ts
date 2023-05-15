import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from 'src/app/handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  number!:number;
  otp:number = 60;
  isOtp: boolean = false;
  isResendClicked:boolean = false;
  istimerEnd:boolean = false;

  timer!:any;

  timermsg:string ="Resend otp after: 00:";
  constructor(private router: Router,
              private handler: HandlerService,
              private http: HttpClient) {
   }

  ngOnInit() {
  }

  IonViewDidLeave(){
    clearInterval(this.timer);

  }

  startTimer(){
    this.timer = setInterval(() =>{
      this.otp -= 1;
      if(this.otp == 0o0){
        this.otp = 0o0;
        clearInterval(this.timer);
        this.istimerEnd = true;
        this.otp = 60;
        console.log("Interval cleared");
        
      }
    },1000)
  }

  onOtpChange(ev:any){
    if(ev.length == 6){
      console.log(ev);
      this.handler.presentLoading("Verifying OTP...")
      this.http.post(environment.URL +'/App/api/v1/verify', {
        "phonenumber": this.number,
        "code":ev
      }).subscribe({
        next:(value:any) =>{
          console.log(value);
          this.handler.dismissLoading();
          let partnerId = value['userID'];
          this.router.navigate(['profile', partnerId]);
          
        },
        error:(error) =>{
          console.log(error);
          this.handler.dismissLoading();
          
        }
      })
      
    }
    
  }

  resendOtp(){
    this.submit();
  }

  submit(){
    this.handler.presentLoading("Sending OTP...")
    console.log(this.number);
  

    this.startTimer();

    this.http.get(environment.URL + '/App/api/v1/SingIn/owners/'+ this.number)
    .subscribe({
      next:(value:any) =>{
        console.log(value);
        // this.isOtp = true;
        // this.istimerEnd = false;
        this.handler.dismissLoading();
        let partnerId = value['id'];
        this.router.navigate(['profile', partnerId]);
      },
      error:(error) =>{
        console.log(error);
        this.handler.dismissLoading();
  
        
      }
  
    })

    // this.http.post(environment.URL +'/App/api/v1/sendOtp', {
    //   "phonenumber": this.number
    // }).subscribe({
    //   next:(value) =>{
    //     console.log(value);
    //     this.isOtp = true;
    //     this.istimerEnd = false;
    //     this.handler.dismissLoading();
    //   },
    //   error:(error) =>{
    //     console.log(error);
    //     this.handler.dismissLoading();

        
    //   }
    // })
    // this.router.navigate(['dash'])

  }
}
