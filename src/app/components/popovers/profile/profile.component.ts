import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private popoverController: PopoverController,
    public authService: AuthService,
    public http: HttpClient
  ) {}

  ngOnInit() {}

  logout() {
    this.popoverController.dismiss({
      action: 'exit',
    });
  }
}
