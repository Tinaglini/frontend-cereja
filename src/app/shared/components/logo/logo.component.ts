import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() size: number = 48;
  @Input() cherryColor: string = '#e11d48'; // Red/Pink (Danger/Cherry natural)
  @Input() stemColor: string = '#16a34a';   // Green (Success/Leaves)
  @Input() bowColor: string = '#db2777';    // Primary Pink
}
