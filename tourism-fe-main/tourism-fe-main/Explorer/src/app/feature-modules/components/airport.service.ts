import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  getAirports(search: string): Observable<any[]> {
    const query = search != '' ? `?search=${search}` : '';
    const url = `${environment.apiHost}airports${query}`;
    return this.http.get<any[]>(url);
  }
}
