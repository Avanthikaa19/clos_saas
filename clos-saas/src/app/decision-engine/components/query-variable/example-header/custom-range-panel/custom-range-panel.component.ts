import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';

const customPresets = [
  'today',
  'today so far',
  'yesterday',
  'Day before yesterday',
  'now',
  'last 1 day',
  'last 7 days',
  'last 10 days',
  'last month',
  'last 2 months',
  'last 5 months',
  'last 10 months',
  'last year',
  'last 2 years',
  'last 5 years',
  'last 10 years',

  // 'this month',
  // 'this year',
  // 'last week',
  // 'last month',
  // 'last year',
] as const; // convert to readonly tuple of string literals

// equivalent to "today" | "last 7 days" | ... | "last year"
type CustomPreset = typeof customPresets[number];

@Component({
  selector: 'app-custom-range-panel',
  templateUrl: './custom-range-panel.component.html',
  styleUrls: ['./custom-range-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRangePanelComponent<D> {
  // list of range presets we want to provide:
  readonly customPresets = customPresets;
  @HostBinding('class.touch-ui')
  readonly isTouchUi = this.picker.touchUi;

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>
  ) {}

  // called when user selects a range preset:
  selectRange(rangeName: CustomPreset): void {
    const [start, end,startDate,endDate] = this.calculateDateRange(rangeName);
    sessionStorage.setItem("start",startDate)
    sessionStorage.setItem("end",endDate)
    console.log("choosed")
    this.picker.select(start);
    this.picker.select(end);
   
    this.picker.close();
  }

  private calculateDateRange(rangeName: CustomPreset): [start: D, end: D,startDate:string,endDate:string] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);

    switch (rangeName) {
      case 'today':
        return [today, today,"now/d","now/d"];
      case 'today so far':
          return [today, today,"now/d","now"];
      case 'yesterday':{
        const start = this.dateAdapter.addCalendarDays(today, -1);
        return [start, start,"now-1 d/d","now-1 d/d"];}
      case 'Day before yesterday':{
        const start = this.dateAdapter.addCalendarDays(today, -2);
        return [start, start,"now-2 d/d","now-2 d/d"];}
      case 'now':
        return [today, today,"now","now"];
      case 'last 1 day': {
          const start = this.dateAdapter.addCalendarDays(today, -1);
          return [start, start,"now-1 d","now-1 d"];
        }
      case 'last 7 days': {
        const start = this.dateAdapter.addCalendarDays(today, -6);
        return [start, today,"now-6 d","now"];
      }
      case 'last 10 days': {
        const start = this.dateAdapter.addCalendarDays(today, -9);
        return [start, today,"now-9 d","now"];
      }
      case 'last month': {
        const start = this.dateAdapter.addCalendarDays(today, -30);
        return [start, today,"now-1 m","now"];
      }
      case 'last 2 months': {
        const start = this.dateAdapter.addCalendarDays(today, -(2*30));
        return [start, today,"now-2 m","now"];
      }
      case 'last 5 months': {
        const start = this.dateAdapter.addCalendarDays(today, -(5*30));
        return [start, today,"now-5 m","now"];
      }
      case 'last 10 months': {
        const start = this.dateAdapter.addCalendarDays(today, -(10*30));
        return [start, today,"now-10 m","now"];
      }
      case 'last year': {
        const start = this.dateAdapter.addCalendarDays(today, -(1*365));
        return [start, today,"now-1 y","now"];
      }
      case 'last 2 years': {
        const start = this.dateAdapter.addCalendarDays(today, -(2*365));
        return [start, today,"now-2 y","now"];
      }
      case 'last 5 years': {
        const start = this.dateAdapter.addCalendarDays(today, -(5*365));
        return [start, today,"now-5 y","now"];
      }
      case 'last 10 years': {
        const start = this.dateAdapter.addCalendarDays(today, -(10*365));
        return [start, today,"now-10 y","now"];
      }
     
      // case 'this month': {
      //   return this.calculateMonth(today);
      // }
      // case 'this year': {
      //   const start = this.dateAdapter.createDate(year, 0, 1);
      //   const end = this.dateAdapter.createDate(year, 11, 31);
      //   return [start, end];
      // }
      // case 'last week': {
      //   const thisDayLastWeek = this.dateAdapter.addCalendarDays(today, -7);
      //   return this.calculateWeek(thisDayLastWeek);
      // }
      // case 'last month': {
      //   const thisDayLastMonth = this.dateAdapter.addCalendarMonths(today, -1);
      //   return this.calculateMonth(thisDayLastMonth);
      // }
      // case 'last year': {
      //   const start = this.dateAdapter.createDate(year - 1, 0, 1);
      //   const end = this.dateAdapter.createDate(year - 1, 11, 31);
      //   return [start, end];
      // }
      default:
        // exhaustiveness check;
        // rangeName has type never, if every possible value is handled in the switch cases.
        // Otherwise, the following line will result in compiler error:
        // "Type 'string' is not assignable to type '[start: D, end: D]'"
        return rangeName;
    }
  }

  private calculateMonth(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    const end = this.dateAdapter.addCalendarDays(
      start,
      this.dateAdapter.getNumDaysInMonth(forDay) - 1
    );
    return [start, end];
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart =
      this.dateAdapter.getFirstDayOfWeek() -
      this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }
}
