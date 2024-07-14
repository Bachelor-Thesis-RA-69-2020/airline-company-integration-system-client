import { Component } from '@angular/core';

@Component({
  selector: 'xp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  openLinkedIn(): void {
    window.open('https://www.linkedin.com/in/markonikolic01/', '_blank');
  }

  openGitHub(): void {
    window.open('https://github.com/marko-nikolic01', '_blank');
  }
}
