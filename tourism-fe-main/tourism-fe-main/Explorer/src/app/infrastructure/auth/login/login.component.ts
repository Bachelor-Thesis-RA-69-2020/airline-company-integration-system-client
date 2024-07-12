import { Component } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: {
    username: string,
    password: string
  } = { username: '', password: '' };

  constructor(
    private notifier: NotifierService, 
    private authService: AuthService,
    private router: Router
    ) {} 

  login() {
    var isValid = true;

    if(this.credentials.username == '') {
      this.notifier.notify('error', "Username can't be empty!");
      isValid = false;
    }

    if(this.credentials.password == '') {
      this.notifier.notify('error', "Password can't be empty!");
      isValid = false;
    }
    
    if(isValid) {
      this.authService.login(this.credentials).subscribe((isAuthnticated: boolean) => {
        if(isAuthnticated) {
          this.notifier.notify('success', "Successfully signed in!");
          this.router.navigate(['/home']);
        }
        else {
          this.notifier.notify('error', "Invalid credentials!");
        }
      });
    }
  }
}
