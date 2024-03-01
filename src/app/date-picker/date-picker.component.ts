import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  selectedDate: Date = new Date();
  constructor(private router: Router) {}

  prevMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      1
    );
  }

  nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      1
    );
  }

  handleDateChange(event: any) {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    const day = this.selectedDate.getDate();

    let str_month = '';
    let str_day = '';

    if (month < 10) {
      str_month = '0' + month.toString();
    } else {
      str_month = month.toString();
    }

    if (day < 10) {
      str_day = '0' + day.toString();
    } else {
      str_day = day.toString();
    }
    const date = `${year}-${str_month}-${str_day}`;

    this.router.navigate(['scores', date]);
  }

  onScroll(event: any) {
    event.preventDefault();
  }
}
