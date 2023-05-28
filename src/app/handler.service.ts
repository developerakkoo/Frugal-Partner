import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  constructor(private loadingController: LoadingController,
              private alertController: AlertController,
              private storage: Storage,
              private toastController: ToastController) {
                this.init();
               }



              async init(){
                await this.storage.create();
              }


              set(key:any, value:any){
                return this.storage.set(key,value);
              }


              get(key:any){
                return this.storage.get(key);
              }

              clear(){
                return this.storage.clear();
              }
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
