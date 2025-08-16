import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faCloudArrowDown, faWallet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-art-1',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './art-1.component.html',
  styleUrl: './art-1.component.scss',
})
export class Art1Component {
  clockIcon = faClock;
  walletIcon = faWallet;
  downloadIcon = faCloudArrowDown;
  sendIcon = faPaperPlane;
}
