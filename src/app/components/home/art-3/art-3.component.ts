import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-art-3',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './art-3.component.html',
  styleUrl: './art-3.component.scss',
})
export class Art3Component {
  clockIcon = faClock;
  userIcon = faUserPlus;
  shieldIcon = faShieldHalved;
  sendIcon = faPaperPlane;
}
