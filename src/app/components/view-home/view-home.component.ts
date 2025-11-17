import { Component, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
    if (this.authService.user.user.user_id == '') {
      this.alertService.modalError('Ha ocurrido un error', 'Error de sesión');
      this.authService.logout();
    }
  }
}
