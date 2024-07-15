import { ChangeDetectorRef, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AirportService } from '../airport.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  way: string = 'One way';
  waySelected: boolean = false;

  stops: string = "Direct";
  stopsSelected: boolean = false;

  flightClass: string = "Economy";
  classSelected: boolean = false;

  adultPassengerCount: number = 1;
  childrenPassengerCount: number = 0;
  passengersSelected: boolean = false;

  currency: string;
  currencies: string = 'AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BRL, BSD, BTN, BWP, BYN, BZD, CAD, CDF, CHF, CLP, CNY, COP, CRC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, EUR, FJD, FKP, FOK, GBP, GEL, GGP, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, IMP, INR, IQD, IRR, ISK, JEP, JMD, JOD, JPY, KES, KGS, KHR, KID, KMF, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRU, MUR, MVR, MWK, MXN, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLE, SLL, SOS, SRD, SSP, STN, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TVD, TWD, TZS, UAH, UGX, USD, UYU, UZS, VES, VND, VUV, WST, XAF, XCD, XDR, XOF, XPF, YER, ZAR, ZMW, ZWL';
  currencyArray: string[];
  currencySelected: boolean = false;

  relationSwitched: boolean = false;

  from: any = null;
  fromAirports: any[];
  fromSearch: string = '';
  fromDisplay: string = 'Where from?';
  fromSelected: boolean = false;

  to: any = null;
  toAirports: any[];
  toSearch: string = '';
  toDisplay: string = 'Where to?';
  toSelected: boolean = false;

  departure: Date = new Date();
  departureSelected: boolean = false;

  return: Date;
  returnSelected: boolean = false;

  separatorHidden: boolean = false;

  expandedQuestions: number[] =[];

  constructor(
    private airportService: AirportService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.return = new Date(this.departure);
    this.return.setDate(this.return.getDate() + 1);

    this.currencyArray = this.currencies.split(', ').map(currency => currency.trim());
    const currencyFromStorage = localStorage.getItem('currency');
    this.currency = currencyFromStorage ? currencyFromStorage : 'USD';
    
    this.airportService.getAirports(this.fromSearch).subscribe({
      next: (result: any[]) => {
          this.fromAirports = result;
          this.toAirports = result;
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  toggleWaySelection() {
    this.waySelected = !this.waySelected;
  }

  closeWaySelection() {
    this.waySelected = false;
  }

  selectWay(way: string) {
    this.way = way;

    if(way == 'Return') {
      this.return = new Date(this.departure);
      this.return.setDate(this.return.getDate() + 1);
    }
  }

  toggleStopsSelection() {
    this.stopsSelected = !this.stopsSelected;
  }

  closeStopsSelection() {
    this.stopsSelected = false;
  }

  selectStops(stops: string) {
    this.stops = stops;
  }

  toggleClassSelection() {
    this.classSelected = !this.classSelected;
  }

  closeClassSelection() {
    this.classSelected = false;
  }

  selectClass(flightClass: string) {
    this.flightClass = flightClass;
  }

  toggleCurrencySelection() {
    this.currencySelected = !this.currencySelected;
  }

  closeCurrencySelection() {
    this.currencySelected = false;
  }

  selectCurrency(currency: string) {
    this.currency = currency;
    localStorage.setItem('currency', currency);
  }

  openPassengersSelection() {
    this.passengersSelected = true;
  }

  closePassengersSelection() {
    this.passengersSelected = false;
  }

  addAdultPassenger() {
    this.adultPassengerCount += 1;
  }

  removeAdultPassenger() {
    if(this.adultPassengerCount > 1) {
      this.adultPassengerCount -= 1;
    }
  }

  addChildPassenger() {
    this.childrenPassengerCount += 1;
  }

  removeChildPassenger() {
    if(this.childrenPassengerCount > 0) {
      this.childrenPassengerCount -= 1;
    }
  }


  openFromSelection() {
    this.fromSelected = true;
  }

  closeFromSelection() {
    this.fromSelected = false;
  }

  searchFromAirports(): void {
    this.airportService.getAirports(this.fromSearch).subscribe({
      next: (result: any[]) => {
          this.fromAirports = result;
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  selectFromAirport(airport: any) {
    this.from = airport;
    this.fromDisplay = `${airport.municipality} (${airport.iata})`;
    this.fromSearch = airport.iata;
    this.fromSelected = false;
    this.airportService.getAirports(this.fromSearch).subscribe({
      next: (result: any[]) => {
          this.fromAirports = result;
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  openToSelection() {
    this.toSelected = true;
  }

  closeToSelection() {
    this.toSelected = false;
  }

  searchToAirports(): void {
    this.airportService.getAirports(this.toSearch).subscribe({
      next: (result: any[]) => {
          this.toAirports = result;
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  selectToAirport(airport: any) {
    this.to = airport;
    this.toDisplay = `${airport.municipality} (${airport.iata})`;
    this.toSearch = airport.iata;
    this.toSelected = false;
    this.airportService.getAirports(this.toSearch).subscribe({
      next: (result: any[]) => {
          this.toAirports = result;
      },
      error: errData => {
          console.log(errData);
      },
    });
  }

  switchAirports() {
    this.relationSwitched = !this.relationSwitched;
    const fromDisplay = this.fromDisplay;
    const toDisplay = this.toDisplay;
    let from = this.from;
    let to = this.to;

    if(fromDisplay == 'Where from?') {
      this.toDisplay = 'Where to?';
      this.toSearch = '';
      to = null;
    }
    else {
      to = this.from;
      this.toDisplay = `${to.municipality} (${to.iata})`;
      this.toSearch = to.iata;
    }

    if(toDisplay == 'Where to?') {
      this.fromDisplay = 'Where from?';
      this.fromSearch = '';
      from = null;
    }
    else {
      from = this.to;
      this.fromDisplay = `${from.municipality} (${from.iata})`;
      this.fromSearch = from.iata;
    }

    this.from = from;
    this.to = to;
    this.searchFromAirports();
    this.searchToAirports();
  }

  convertDateFormat(date: Date, format: string) : string {
    const formattedDate = this.datePipe.transform(date, format);
    return formattedDate ? formattedDate : '';
  }

  openDepartureSelection() {
    this.departureSelected = true;
  }

  closeDepartureSelection() {
    this.departureSelected = false;
  }

  openReturnSelection() {
    this.returnSelected = true;
  }

  closeReturnSelection() {
    this.returnSelected = false;
  }

  addTimeToDeparture(date: Date, type: 'day' | 'month' | 'year'): void {
    const newDate = new Date(date);

    switch(type) {
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

    this.departure = newDate;

    if (this.return <= this.departure) {
      this.return = new Date(this.departure);
      this.return.setDate(this.return.getDate() + 1);
    }
  }

  removeTimeFromDeparture(date: Date, type: 'day' | 'month' | 'year'): void {
    const newDate = new Date(date);
    const currentDate = new Date();

    switch(type) {
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

    if (newDate >= currentDate) {
      this.departure = newDate;
    }
  }

  addTimeToReturn(date: Date, type: 'day' | 'month' | 'year'): void {
    const newDate = new Date(date);

    switch(type) {
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

    this.return = newDate;
  }

  removeTimeFromReturn(date: Date, type: 'day' | 'month' | 'year'): void {
    const newDate = new Date(date);

    switch(type) {
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

    if (newDate > this.departure) {
      this.return = newDate;
    }
  }

  hideSeparator(isHovering: boolean): void {
    const elements = document.querySelectorAll('.date-separator');
    elements.forEach((element) => {
      if (isHovering) {
        this.separatorHidden = true;
      } else {
        this.separatorHidden = false;
      }
    });
  }

  search() {
    if(this.validateSearch()) {
      console.log(this.from)
      console.log(this.to)

      const fromQuery = this.from.iata;
      
      const toQuery = this.to.iata;

      this.departure.setUTCHours(0, 0, 0, 0);
      const departureQuery = this.departure.toISOString();

      let returnQuery;
      if(this.way == 'Return') {
        this.return.setUTCHours(0, 0, 0, 0);
        returnQuery = this.return.toISOString();
      } else {
        returnQuery = '';
      }
      
      const wayQuery = this.way;

      const stopsQuery = this.stops == 'Direct' ? false : true;

      const adultPassengerCountQuery = this.adultPassengerCount;

      const childrenPassengerCountQuery = this.childrenPassengerCount;

      const flightClassQuery = this.flightClass;

      const currencyQuery = this.currency;

      let queryParams: any = { 
        from: fromQuery,
        to: toQuery,
        type: wayQuery,
        includeStops: stopsQuery,
        adultPassengerCount: adultPassengerCountQuery,
        childrenPassengerCount: childrenPassengerCountQuery,
        flightClass: flightClassQuery,
        currency: currencyQuery
      };
      
      queryParams['departure'] = departureQuery;
    
      if (this.way == 'Return') {
        queryParams['return'] = returnQuery;
      }

      this.router.navigate(['/flight-search'], {
        queryParams: queryParams
      });
    }
  }

  validateSearch() : boolean {
    let isValid = true;

    if(this.fromDisplay == 'Where from?') {
      this.notifier.notify('error', 'You must select a departure airport.');
      isValid = false;
    }

    if(this.toDisplay == 'Where to?') {
      this.notifier.notify('error', 'You must select a destination airport.');
      isValid = false;
    }

    if(this.fromDisplay != 'Where from?' && this.toDisplay != 'Where to?' && this.fromDisplay == this.toDisplay) {
      this.notifier.notify('error', 'Departure airport and destination airport can\'t be the same airport.');
      isValid = false;
    }

    return isValid;
  }

  toggleQuestionExpansion(questionIndex: number) {
    const index = this.expandedQuestions.indexOf(questionIndex);
    if (index !== -1) {
      this.expandedQuestions.splice(index, 1);
    } else {
      this.expandedQuestions.push(questionIndex);
    }
  }

  isQuestionExpanded(questionIndex: number): boolean {
    const isExpanded = this.expandedQuestions.includes(questionIndex);
    return isExpanded;
  }
}