import { Component, OnInit } from '@angular/core';
import { HandlerService } from '../handler.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-set-pin',
  templateUrl: './set-pin.page.html',
  styleUrls: ['./set-pin.page.scss'],
})
export class SetPinPage implements OnInit {

  pin!:string;
  partnerId:any;
  constructor(private handler: HandlerService,
              private alertController: AlertController,
              private route: ActivatedRoute,
              private router: Router) {
                this.partnerId = this.route.snapshot.paramMap.get("id");
               }

  ngOnInit() {
  }

  async presentAlertConfirm(ev:any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you confirm your pin?',
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
            this.handler.set("pin",ev).then((set) =>{
              this.router.navigate(['profile', this.partnerId]);
              
            }).catch((error) =>{
              console.log("ERROR SETING PIN");
              
            })
          }
        }
      ]
    });
  
    await alert.present();
  }
  pinSetEvent(ev:any){
    console.log(ev);
    if(ev.length == 4){
      console.log(ev);
      this.presentAlertConfirm(ev);
      
    }
    
  }
}
