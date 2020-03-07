import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AuthService,
    private snackBard: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  forgot() {
    const email = this.forgotForm.value.email;
    this.authService.forgotPassword(email)
    .pipe(first())
    .subscribe( data => {
      this.snackBard.open('Please check your email for instructions', null, {duration: 3000});
      this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
        const errorMessage = error['0'].messages['0'].message;
        this.snackBard.open(errorMessage, null, {duration: 3000});
      });
  }
}
