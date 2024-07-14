import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  search(flightSerialNumbers: string[], passengers: any[], email: string, flightClass: string): Observable<any> {
    let passengersFormatted: any[] = [];

    passengers.forEach(passenger => {
      const passengerFormatted = {
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        passportNumber: passenger.passportNumber,
        birthDate: passenger.birthDate.toISOString()
      };

      passengersFormatted.push(passengerFormatted);
    });

    const booking = {
      flightNumbers: flightSerialNumbers,
      passengers: passengersFormatted,
      email: email,
      flightClass: flightClass
    };

    console.log(booking)

    const url = `${environment.apiHost}flights/booking`;
    return this.http.post<any>(url, booking);
  }
}
