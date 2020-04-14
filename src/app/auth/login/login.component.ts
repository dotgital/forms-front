import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide = true;
  public loading: boolean;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBard: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.loading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password)
    .pipe(first())
    .subscribe(
        data => {
          this.router.navigate(['/']).then(() => {
            this.loading = false;
          });
        },
        error => {
          console.log(error);
          this.loading = false;
          const errorMessage = error['0'].messages['0'].message;
          this.snackBard.open(errorMessage, null, {duration: 3000});
        });
  }

}
