import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  constructor(private loadingController: LoadingController,
              private alertController: AlertController,
              private toastController: ToastController) { }


              async presentLoading(msg: string) {
                const loading = await this.loadingController.create({
                  message: msg,
                });
                await loading.present();
              }



              async dismissLoading(){
                this.loadingController.dismiss()
              }


              async presentToast(msg: string) {
                const toast = await this.toastController.create({
                  message: msg,
                  duration: 2000
                });
                toast.present();
              }


             async presentAlert(msg: string, header: string) {
              const alert = await this.alertController.create({
                header: header,
                message: msg,
                buttons: ['OK']
              });
             
              await alert.present();
             }
}
