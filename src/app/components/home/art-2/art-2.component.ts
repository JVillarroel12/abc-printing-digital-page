import { Component } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import {
  faCloudArrowDown,
  faWallet,
  faDesktop,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-art-2',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './art-2.component.html',
  styleUrl: './art-2.component.scss',
})
export class Art2Component {
  clockIcon = faClock;
  desktopIcon = faDesktop;
  downloadIcon = faCloudArrowDown;
  sendIcon = faPaperPlane;
}
