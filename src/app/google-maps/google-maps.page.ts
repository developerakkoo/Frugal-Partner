import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
declare var google: any;
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.page.html',
  styleUrls: ['./google-maps.page.scss'],
})
export class GoogleMapsPage implements OnInit {

  @Input() value:any;

  marker:any;
  Automarker:any;
  @ViewChild('map') mapView!: ElementRef;



  map: any;

  lat: any;
  lng: any;
  constructor(private http: HttpClient,
              private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.value);
    this.getDriverLoc();
    
  }

  dismiss()
  {
    this.modalController.dismiss();
  }


  getDriverLoc(){
    this.http.get(environment.URL + `/App/api/v1/getById/vehicle/${this.value}`).subscribe({
      next:(value:any) =>{
        console.log(value);
        this.lat = value['vehicle'][0]['coordinates'][0]
        this.lng = value['vehicle'][0]['coordinates'][1]
        this.getUserPosition();
      },
      error:(error:any) =>{
        console.log(error);
        
      }
    })
  }
  async getUserPosition() {

    console.log("Add map get user pos");
    
    // let position = await Geolocation.getCurrentPosition();
    // console.log(position.coords.latitude);
    // console.log(position.coords.longitude);

    // this.lat = position.coords.latitude;
    // this.lng = position.coords.longitude;

    this.addMap(this.lat, this.lng);
  }
  addMap(lat: any, lon: any) {

    let latlng = new google.maps.LatLng(lat, lon);

    let mapOptions = {
      center: latlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    this.map = new google.maps.Map(this.mapView.nativeElement, mapOptions);
    
 

    this.addMarker();

  }

  addMarker() {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      zoom: 90,
      draggable: true,
      // icon: '/assets/rikshaw.png',
      label: { color: '#121212', fontWeight: 'bold', fontSize: '10px', text: 'YOU ARE HERE!' }
      //icon: ''
    });

    // this.getOnDragEvent(this.marker);

    // let content = "<p>Your Current Location</p>";
    // this.getAllAutos();

  }
}
