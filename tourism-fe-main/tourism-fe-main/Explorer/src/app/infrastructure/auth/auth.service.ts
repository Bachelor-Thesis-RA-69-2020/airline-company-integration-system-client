import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "" });

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  login(credentials: any): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.tryLogin(credentials).subscribe({
        next: (result) => {
          localStorage.setItem("username", credentials.username);
          localStorage.setItem("role", result.role);
          observer.next(true);
          observer.complete();
        },
        error: err => {
          console.error('Login error:', err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  tryLogin(credentials:any): Observable<any> {
    var url = environment.apiHost + "users/login"
    return this.http.post(url, credentials);
  }

  logout(): void {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  getUsername(): string {
    var username = localStorage.getItem("username");
    return username ? username : "";
  }

  getRole(): string {
    var role = localStorage.getItem("role");
    return role ? role : "";
  }
}
