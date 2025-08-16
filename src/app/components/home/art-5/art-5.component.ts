import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-art-5',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './art-5.component.html',
  styleUrl: './art-5.component.scss',
})
export class Art5Component {
  sendIcon = faPaperPlane;
}
