import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faCloudArrowDown, faDesktop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-art-4',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './art-4.component.html',
  styleUrl: './art-4.component.scss',
})
export class Art4Component {
  clockIcon = faClock;
  desktopIcon = faDesktop;
  downloadIcon = faCloudArrowDown;
  sendIcon = faPaperPlane;
}
