import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HandlerService } from '../handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-enter-pin',
  templateUrl: './enter-pin.page.html',
  styleUrls: ['./enter-pin.page.scss'],
})
export class EnterPinPage implements OnInit {

  pin!:string;
  partnerId:any;

  getOtpSub!: Subscription;
  constructor(private handler: HandlerService,
              private alertController: AlertController,
              private route: ActivatedRoute,
              private router: Router) {
                this.partnerId = this.route.snapshot.paramMap.get("id");
               }

  ngOnInit() {
  }


  ionViewDidLeave(){
    this.getOtpSub.unsubscribe();
  }
  pinSetEvent(ev:any){
    console.log(ev);
    if(ev.length == 4){
      console.log(ev);
      this.checkForPin(ev);
    }
    
  }


  async checkForPin(pin:any){
    let value = await this.handler.get("pin");
    if(value == pin){
      console.log("PIN MATCHED");
      this.router.navigate(['profile', this.partnerId]);
      
      
    }else{
      this.handler.presentToast("Wrong Pin Entered!");
    }
  }

}
