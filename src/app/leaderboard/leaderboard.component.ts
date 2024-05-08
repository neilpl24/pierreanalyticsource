import { ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  @Input() type: string = 'skaters'; // the default type is skater
  routeType: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const type = paramMap.get('type'); // Assuming 'type' is a parameter in your route
      if (type) {
        this.setType(type);
      }
    });
  }

  setType(type: string) {
    if (type != this.type) {
      this.type = type;
    }
  }
}
