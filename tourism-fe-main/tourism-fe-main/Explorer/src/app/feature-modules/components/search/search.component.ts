import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../flight.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BookingService } from '../booking.service';
import { BookingComponent } from '../booking/booking.component';

@Component({
  selector: 'xp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  from: string;
  to: string;
  departure: Date;
  return: Date;
  way: string;
  stops: string;
  adultPassengerCount: number;
  childrenPassengerCount: number;
  flightClass: string;
  currency: string;

  oneWayFlights: any[] = [];
  returnFlights: any[] = [];
  selectedFlights: any[] = [[], []];

  expandedOneWayFlights: number[] =[];
  expandedReturnFlights: number[] =[];
  expandedSelectedFlights: number[] =[];

  passengers: any[] = [];

  expandedDatePickers: number[] =[];

  email: string = '';

  display: string = 'DEPARTURE_FLIGHTS';

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private notifier: NotifierService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.from = params['from'];
      this.to = params['to'];
      this.departure = params['departure'];
      this.way = params['type'];
      this.stops = params['includeStops'] ;
      this.adultPassengerCount = params['adultPassengerCount'];
      this.childrenPassengerCount = params['childrenPassengerCount'];
      this.flightClass = params['flightClass'];
      this.currency = params['currency'];

      if (params['return']) {
        this.return = params['return'];
      }

      for(let i = 0; i < this.getPassengerCount(true) + this.getPassengerCount(false);  i++) {
        this.passengers.push({
          firstName: '',
          lastName: '',
          passportNumber: ''
        });

        let date = new Date();
        if(i < this.adultPassengerCount) {
          date.setFullYear(date.getFullYear() - 12);
          this.passengers[i].birthDate = date;
        } else {
          this.passengers[i].birthDate = date;
        }
      }
    });

    this.flightService.search(this.from, this.to, this.departure, this.return, this.way, this.stops, this.adultPassengerCount, this.childrenPassengerCount, this.flightClass, this.currency).subscribe({
      next: (result: any) => {
        if(this.way == 'One way' && this.stops == 'false') {
          this.oneWayFlights = result.directFlights.map((f: any) => [f]);
        } else if(this.way == 'One way' && this.stops == 'true') {
          this.oneWayFlights = result.indirectFlights;
        } else if(this.way == 'Return' && this.stops == 'false') {
          this.oneWayFlights = result.directFlights.map((f: any) => [f]);
          this.returnFlights = result.returnDirectFlights.map((f: any) => [f]);
        } else if(this.way == 'Return' && this.stops == 'true') {
          this.oneWayFlights = result.indirectFlights;
          this.returnFlights = result.returnIndirectFlights;
        }
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  convertDateFormat(date: Date, format: string) : string {
    const formattedDate = this.datePipe.transform(date, format);
    return formattedDate ? formattedDate : '';
  }

  convertDurationFormat(flight: any): string {
    let duration = 0;

    flight.forEach((f: any) => {
      duration += f.duration;
    });
    const hours = Math.floor(duration / 60);
    const remainingMinutes = duration % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }

  convertDurationFormatFlight(flight: any): string {
    const hours = Math.floor(flight.duration / 60);
    const remainingMinutes = flight.duration % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }

  calculateTotalStopTime(flight: any): string {
    let totalStopTime = 0;
  
    for (let i = 0; i < flight.length - 1; i++) {
      const currentArrival = new Date(flight[i].arrivalTimestamp);
      const nextDeparture = new Date(flight[i + 1].departureTimestamp);
  
      const stopTime = (nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60);
      totalStopTime += stopTime;
    }

    const hours = Math.floor(totalStopTime / 60);
    const remainingMinutes = totalStopTime % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }

  calculatePrice(flight: any): number {
    let totalPrice = 0;
  
    for (let i = 0; i < flight.length; i++) {
      totalPrice += flight[i].price;
    }

    return parseFloat(totalPrice.toFixed(2));
  }

  getAirlineCompanyName(flight: any): string {
    const serialNumberPrefix = flight.flightNumber.substring(0, 3);

    if(serialNumberPrefix == 'AL1') {
      return 'Eclipse Air';
    } else if(serialNumberPrefix == 'AL2') {
      return 'Horizon Airways';
    } else if(serialNumberPrefix == 'AL3') {
      return 'Zenith Airlines';
    }

    return 'Unknown';
  }

  toggleOneWayFlightExpansion(flightIndex: number) {
    const index = this.expandedOneWayFlights.indexOf(flightIndex);
    if (index !== -1) {
      this.expandedOneWayFlights.splice(index, 1);
    } else {
      this.expandedOneWayFlights.push(flightIndex);
    }
  }

  isOneWayFlightExpanded(flightIndex: number): boolean {
    const isExpanded = this.expandedOneWayFlights.includes(flightIndex);
    return isExpanded;
  }

  toggleReturnFlightExpansion(flightIndex: number) {
    const index = this.expandedReturnFlights.indexOf(flightIndex);
    if (index !== -1) {
      this.expandedReturnFlights.splice(index, 1);
    } else {
      this.expandedReturnFlights.push(flightIndex);
    }
  }

  isReturnFlightExpanded(flightIndex: number): boolean {
    const isExpanded = this.expandedReturnFlights.includes(flightIndex);
    return isExpanded;
  }

  toggleSelectedFlightExpansion(flightIndex: number) {
    const index = this.expandedSelectedFlights.indexOf(flightIndex);
    if (index !== -1) {
      this.expandedSelectedFlights.splice(index, 1);
    } else {
      this.expandedSelectedFlights.push(flightIndex);
    }
  }

  isSelectedFlightExpanded(flightIndex: number): boolean {
    const isExpanded = this.expandedSelectedFlights.includes(flightIndex);
    return isExpanded;
  }

  selectOneWayFlight(event: Event, flight: any) {
    event.stopPropagation();
    this.selectedFlights[0] = flight;
    if(this.way == 'Return') {
      this.changeDisplay('RETURN_FLIGHTS');
    } else if(this.way == 'One way') {
      this.changeDisplay('BOOKING');
    }
  }

  selectReturnFlight(event: Event, flight: any) {
    event.stopPropagation();
    this.selectedFlights[1] = flight;
    this.changeDisplay('BOOKING');
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return hours + ':' + minutesStr + ' ' + ampm;
  }

  hasLayower(index: number, flight: any): boolean {
    if(index + 1 >= flight.length) {
      return false;
    }

    return true;
  }

  calculateLayoverTime(index: number, flight: any): string {
    const currentArrival = new Date(flight[index].arrivalTimestamp);
    const nextDeparture = new Date(flight[index + 1].departureTimestamp);

    const stopTime = (nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60);

    const hours = Math.floor(stopTime / 60);
    const remainingMinutes = stopTime % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }

  getLayoverAirport(index: number, flight: any): string {
    const layowerFlight = flight[index + 1];
    const layowerAirport = `${layowerFlight.fromAirportName} (${layowerFlight.fromAirportIata})`;

    return layowerAirport;
  }

  changeDisplay(display: string) {
    if(display == 'BOOKING') {
      this.expandedSelectedFlights = [];
    }

    this.display = display;
  }

  getSelectedFlights(): any {
    if(this.way == 'One way') {
      return [this.selectedFlights[0]];
    }
    return [this.selectedFlights[0], this.selectedFlights[1]];
  }

  getPassengerCount(adult: boolean): number {
    if(adult) {
      return Number(this.adultPassengerCount);
    }

    return Number(this.childrenPassengerCount);
  }

  getAllPassengerCount() {
    return Number(this.adultPassengerCount) + Number(this.childrenPassengerCount);
  }

  openDatePickerExpansion(passengerIndex: number) {
    const index = this.expandedDatePickers.indexOf(passengerIndex);
    if (index !== -1) {
      return;
    } else {
    const index = this.expandedDatePickers.indexOf(passengerIndex);
      this.expandedDatePickers.push(passengerIndex);
    }
  }

  closeDatePickerExpansion(passengerIndex: number) {
    const index = this.expandedDatePickers.indexOf(passengerIndex);
    if (index !== -1) {
      this.expandedDatePickers.splice(index, 1);
    } else {
      return;
    }
  }

  isDatePickerExpanded(passengerIndex: number): boolean {
    const isExpanded = this.expandedDatePickers.includes(passengerIndex);
    return isExpanded;
  }

  addTimeToPassengerBirthDate(index: number, type: 'day' | 'month' | 'year'): void {
    const date = this.passengers[index].birthDate;
    const newDate = new Date(date);

    switch (type) {
        case 'day':
            newDate.setDate(newDate.getDate() + 1);
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        case 'year':
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
        default:
            throw new Error('Invalid type. Use "day", "month", or "year".');
    }

    const today = new Date();
    const twelveYearsAgo = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const isChild = newDate > twelveYearsAgo;
    const isAdult = newDate <= twelveYearsAgo;

    if (!this.isPassengerAdult(index) && isChild && newDate <= today) {
        this.passengers[index].birthDate = newDate;
    } else if (this.isPassengerAdult(index) && isAdult && newDate <= today) {
        this.passengers[index].birthDate = newDate;
    }
}

removeTimeFromPassengerBirthDate(index: number, type: 'day' | 'month' | 'year'): void {
    const date = this.passengers[index].birthDate;
    const newDate = new Date(date);

    switch (type) {
        case 'day':
            newDate.setDate(newDate.getDate() - 1);
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        case 'year':
            newDate.setFullYear(newDate.getFullYear() - 1);
            break;
        default:
            throw new Error('Invalid type. Use "day", "month", or "year".');
    }

    const today = new Date();
    const twelveYearsAgo = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const oneHundredFiftyYearsAgo = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const isChild = newDate >= twelveYearsAgo;
    const isAdult = newDate <= twelveYearsAgo && newDate >= oneHundredFiftyYearsAgo;

    if (!this.isPassengerAdult(index) && isChild && newDate <= today) {
        this.passengers[index].birthDate = newDate;
    } else if (this.isPassengerAdult(index) && isAdult && newDate <= today) {
        this.passengers[index].birthDate = newDate;
    }
}

  isPassengerAdult(index: number): boolean {
    const isPassengerAdult = index < this.getPassengerCount(true);
    return isPassengerAdult;
  }

  getFlightCount(): number {
    let flightCount = this.selectedFlights[0].length;

    if(this.way == 'Return') {
      flightCount = this.selectedFlights[0].length;
    }

    return flightCount;
  }

  openBookingSuccessfullDialog(): void {
    const dialogRef = this.dialog.open(BookingComponent, {});
  }

  bookFlights() {
    if(this.validateBooking()) {
      let flightSerialNumbers: string[] = [];

      this.selectedFlights[0].forEach((flight: any) => {
        flightSerialNumbers.push(flight.flightNumber);
      });

      if(this.way == 'Return') {
        this.selectedFlights[1].forEach((flight: any) => {
          flightSerialNumbers.push(flight.flightNumber);
        });
      }

      this.bookingService.search(flightSerialNumbers, this.passengers, this.email, this.flightClass).subscribe({
        next: (result: any) => {
          this.notifier.notify('success', `Booking successful.`);
          this.openBookingSuccessfullDialog();
        },
        error: errData => {
            console.log(errData);
        },
      });
    }
  }

  validateBooking(): boolean {
    let isValid = true;

    this.passengers.forEach((passenger, index) => {
        if (!passenger.firstName) {
            console.error(`Passenger ${index + 1}: First name is empty`);
            this.notifier.notify('error', `Passenger ${index + 1} - First name can't be empty.`);
            isValid = false;
        }
        if (!passenger.lastName) {
          this.notifier.notify('error', `Passenger ${index + 1} - Last name can't be empty.`);
            isValid = false;
        }
        if (!passenger.passportNumber) {
          this.notifier.notify('error', `Passenger ${index + 1} - Passport number can't be empty.`);
            isValid = false;
        }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.notifier.notify('error', `Email - Email can't be empty.`);
        isValid = false;
    } else if (!emailRegex.test(this.email)) {
      this.notifier.notify('error', `Email - Invalid email format.`);
        isValid = false;
    }

    return isValid;
}

}
