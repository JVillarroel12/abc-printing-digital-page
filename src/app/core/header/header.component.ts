import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {} from '@fortawesome/free-regular-svg-icons';
import { faHome, faBook, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Router } from 'express';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  homeIcon = faHome;
  bookIcon = faBook;
  printIcon = faPrint;
  nav = [
    {
      label: 'Inicio',
      link: '/',
    },
    {
      label: 'Documentacion',
      link: '/documentation',
    },
  ];
  constructor() {}
  goPortal() {}
}
