import { Component, OnInit, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  isVisible = false;
  isOkLoading = false;  
  isVisibleMiddle = true;

  @HostListener('window:keyup.enter') pressedEnter() {
    this.handleOk();
  }

  constructor(private fb: UntypedFormBuilder,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    this.isVisible = true;
  }
  
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    this.authService.login(this.validateForm.value.username, this.validateForm.value.password, "/table")
    setTimeout(() => {
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
