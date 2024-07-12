import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../flight.service';

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

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute
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
    });

    this.flightService.search(this.from, this.to, this.departure, this.return, this.way, this.stops, this.adultPassengerCount, this.childrenPassengerCount, this.flightClass, this.currency).subscribe({
      next: (result: any[]) => {
        console.log(result)
      },
      error: errData => {
          console.log(errData);
      },
    });
  }
}
