import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { User } from 'src/app/_interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public hide = true;
  public loading: boolean;
  public userId: string;

  registerForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    company: new FormControl(null, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/']);
    }
  }

  register() {
    this.loading = true;
    if (!this.registerForm.invalid) {
      this.authService.register(this.registerForm.value).subscribe(res => {
        this.userId = res.user.id;
        console.log(res);
        this.createCompany();
      });
    }
  }

  createCompany() {
    this.authService.createCompany(this.registerForm.value, this.userId).subscribe(res => {
      console.log(res);
      this.router.navigate(['/']);
    });
  }
}
