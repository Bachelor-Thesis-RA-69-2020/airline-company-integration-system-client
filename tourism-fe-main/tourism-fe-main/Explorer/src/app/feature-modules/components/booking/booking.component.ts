import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingComponent>,
    private router: Router
  ) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

