import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  search(from: string, to: string, departure: Date, returnDate: Date, way: string, stops: string, adultPassengerCount: number, childrenPassengerCount: number, flightClass: string, currency: string): Observable<any[]> {
    console.log(stops)
    const fromAirportIataQuery = `?fromAirportIATA=${from}`;
    const toAirportIataQuery = `&toAirportIATA=${to}`;
    const fromQuery = `&from=${this.getStartOfDay(departure)}`;
    const toQuery = `&to=${this.getEndOfDay(departure)}`;
    const flightClassQuery = `&flightClass=${flightClass}`;
    const adultPassengerCountQuery = `&adultPassengerCount=${adultPassengerCount}`;
    const childPassengerCountQuery = `&childPassengerCount=${childrenPassengerCount}`;
    const returnQuery = `&return=${way == 'Return' ? true : false}`;
    const returnFromQuery = way == 'Return' ? `&returnFrom=${this.getStartOfDay(returnDate)}` : `&returnFrom=${this.getStartOfDay(departure)}`;
    const returnToQuery = way == 'Return' ? `&returnTo=${this.getEndOfDay(returnDate)}` : `&returnTo=${this.getEndOfDay(departure)}`;
    const directQuery = `&direct=${stops == 'true' ? 'false' : 'true'}`;
    const currencyQuery = `&currency=${currency}`;
    
    console.log(directQuery);
    const query = fromAirportIataQuery + 
                  toAirportIataQuery +
                  fromQuery + 
                  toQuery + 
                  flightClassQuery + 
                  adultPassengerCountQuery + 
                  childPassengerCountQuery + 
                  returnQuery + 
                  returnFromQuery + 
                  returnToQuery + 
                  directQuery +
                  currencyQuery;
    const url = `${environment.apiHost}flights${query}`;
    return this.http.get<any[]>(url);
  }

  getStartOfDay(date: Date): string {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 1);
    return startOfDay.toISOString();
  }
  
  getEndOfDay(date: Date): string {
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    return endOfDay.toISOString();
  }
}
