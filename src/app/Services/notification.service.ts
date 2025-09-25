import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification:ToastrService ) { }

  showSuccess(message: string, title: string) {
    this.notification.success(message, title);
  }

  showError(message: string, title: string) {
    this.notification.error(message, title);
  }

  showInfo(message: string, title: string) {
    this.notification.info(message, title);
  }

  showWarning(message: string, title: string) {
    this.notification.warning(message, title);
  }

  showDefault(message: string, title: string) {
    this.notification.show(message, title);
  }
}
