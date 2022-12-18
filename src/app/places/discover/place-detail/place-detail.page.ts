import { Booking } from './../../../bookings/booking.model';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { BookingService } from './../../../bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable: boolean;
  isLoading: boolean;
  private placesSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingservice: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.isBookable = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      if (!param.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      // this.place = this.placesService.getPlace(param.get('placeId'));
      this.isLoading = true;
      this.placesSub = this.placesService
        .getPlace(param.get('placeId'))
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== this.authService.userId;
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Could not Load place, please try again later',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  onBookPlace() {
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCrtl.pop();
    this.actionSheetController
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',

            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',

            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingsComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        // console.log(resultData.data.bookingData.firstName, resultData.role);
        const data = resultData.data.bookingData;
        console.log('--------------------------------');
        console.log(data.firstName);
        if (resultData.role === 'confirm') {
          console.log('BOOKED');
          this.loadingCtrl
            .create({
              spinner: 'bubbles',
              message: `${data.firstName} you are booking  ${this.place.title}`,
            })
            .then((loadingEl) => {
              loadingEl.present();
              this.bookingservice
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imgUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng,
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address,
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
