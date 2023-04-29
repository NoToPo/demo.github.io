import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpServerService } from './services/http-server.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterContentChecked {
  title = 'Real-Estate-UI';
  isCollapsed = true;

  // ChangePassword properties
  isVisibleChangePassword = false;
  validateFormChangePassword!: UntypedFormGroup;

  // Register properties
  isVisibleSignUp = false;
  validateFormSignUp!: UntypedFormGroup;
  result = '';
  showResult = false;
  format = 'dd/MM/yyyy';
  userInfor: any;

  constructor(public authService: AuthService,
    private router: Router,
    private fb: UntypedFormBuilder,
    public httpServerService: HttpServerService,
    private modal: NzModalService) {}


  handleCancelChangePassword(): void {
    this.isVisibleChangePassword = false;
  }

  ngAfterContentChecked(): void {
      this.userInfor = this.authService.getInfoUser();
  }

  logIn(): void {
    if (!this.authService.isLoggedIn()) {
      window.location.reload();
      this.router.navigate(['/login']);
    }
  }

  logOut(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      window.location.reload();
    }
  }

  changePassWord(): void {
    this.isVisibleChangePassword = true;
  }

  submitFormChangePassword(): void {
    if (this.validateFormChangePassword.valid) {
      this.httpServerService.changePassword(this.validateFormChangePassword.value.email,
        this.validateFormChangePassword.value.oldpassword,
        this.validateFormChangePassword.value.newpassword,
        this.validateFormChangePassword.value.renewpassword)
        .subscribe(res => {
          if (res.success === true) {
            this.success(res.result);
          } else {
            this.error(res.result);
          }
        },
        error => {          
          this.error(error.error.result);
        });
    } else {
      Object.values(this.validateFormChangePassword.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidatorChangePassword(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateFormChangePassword.controls['renewpassword'].updateValueAndValidity());
  }

  confirmationValidatorChangePassword = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateFormChangePassword.controls['newpassword'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  signUp(): void {
    if (this.authService.isLoggedIn()) {
      this.isVisibleSignUp = true;
    }
  }

  submitSignUpForm(): void {
    if (this.validateFormSignUp.valid) {
      this.httpServerService.signUp(this.validateFormSignUp.value.emailSignUp,
        this.validateFormSignUp.value.passwordSignUp,
        this.validateFormSignUp.value.firstNameSignUp,
        this.validateFormSignUp.value.lastNameSignUp,
        this.validateFormSignUp.value.dateOfBirthSignUp)
        .subscribe(res => {
          if (res.success === true) {
            this.success(res.result);
          }
          else {
            this.error(res.result);
          }
        },
          error => { this.error(error.error.result); });
    } else {
      Object.values(this.validateFormSignUp.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelSignUpForm(): void {
    this.isVisibleSignUp = false;
  }

  cancelShowResult(): void {
    this.showResult = false
  }

  error(message: string): void {
    this.modal.error({
      nzTitle: 'Lỗi',
      nzContent: message,
      nzCentered: true
    });
  }

  success(message: string): void {
    this.modal.success({
      nzTitle: 'Thành công',
      nzContent: message,
      nzCentered: true
    });
  }

  ngOnInit(): void {
    this.validateFormChangePassword = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      oldpassword: [null, [Validators.required]],
      newpassword: [null, [Validators.required]],
      renewpassword: [null, [Validators.required, this.confirmationValidatorChangePassword]]
    });

    this.validateFormSignUp = this.fb.group({
      emailSignUp: [null, [Validators.email, Validators.required]],
      passwordSignUp: [null, [Validators.required]],
      firstNameSignUp: [null, [Validators.required]],
      lastNameSignUp: [null, [Validators.required]],
      dateOfBirthSignUp: [null, [Validators.required]]
    });
  }
}
