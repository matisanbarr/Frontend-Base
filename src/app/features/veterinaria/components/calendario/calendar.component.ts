import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  private calendarApi: any;
  private currentDate: Date = new Date();

  navigate(delta: number) {
    if (this.calendarApi) {
      this.calendarApi.incrementDate({ days: delta });
      this.currentDate = this.calendarApi.getDate();
    }
  }

  goToday() {
    if (this.calendarApi) {
      this.calendarApi.today();
      this.currentDate = this.calendarApi.getDate();
    }
  }

  getCurrentDay(): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return this.currentDate.toLocaleDateString('es-CL', options);
  }

  onCalendarInit(calendar: any) {
    this.calendarApi = calendar.getApi();
    this.currentDate = this.calendarApi.getDate();
  }
  @Output() daySelected = new EventEmitter<{ start: Date; end: Date }>();
  @Output() eventCreateRequest = new EventEmitter<{ date: Date; allDay: boolean; end?: Date }>();

  private _defaultOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    timeZone: 'local',
    headerToolbar: {
      left: 'today',
      center: 'prev,title,next',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    footerToolbar: false,
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
      prev: '◀️',
      next: '▶️',
    },
    events: [],
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventColor: '#1976d2',
    eventBackgroundColor: '#42a5f5',
    eventBorderColor: '#1976d2',
    eventTextColor: '#fff',
    height: 'auto',
    aspectRatio: 1.5,
    allDayText: 'Día',
    slotDuration: '00:15:00',
    slotLabelInterval: '00:15:00',
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    weekends: true,
    weekNumbers: true,
    nowIndicator: true,
    showNonCurrentDates: true,
    navLinks: true,
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    dayHeaderFormat: { weekday: 'long' },
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    select: (info) => {
      this.eventCreateRequest.emit({ date: info.start, allDay: info.allDay, end: info.end });
    },
    dateClick: (info) => {
      this.eventCreateRequest.emit({ date: info.date, allDay: info.allDay });
    },
    eventClick: (info) => {},
    eventDrop: (info) => {},
    eventResize: (info) => {},
    eventMouseEnter: (info) => {},
    eventMouseLeave: (info) => {},
    datesSet: (info) => {},
    viewDidMount: (info) => {},
    dayCellDidMount: (info) => {},
    eventDidMount: (info) => {},
    loading: (isLoading) => {},
    windowResize: (info) => {},
  };

  public mergedOptions: CalendarOptions = { ...this._defaultOptions };

  @Input() set calendarOptions(value: CalendarOptions) {
    // Solo fusiona opciones visuales, preservando los handlers
    this.mergedOptions = { ...this._defaultOptions, ...value };
    this.mergedOptions.select = this._defaultOptions.select;
    this.mergedOptions.eventClick = this._defaultOptions.eventClick;
    this.mergedOptions.eventDrop = this._defaultOptions.eventDrop;
    this.mergedOptions.dateClick = this._defaultOptions.dateClick;
    if (value?.headerToolbar) {
      this.mergedOptions.headerToolbar = {
        ...this._defaultOptions.headerToolbar,
        ...value.headerToolbar,
      };
    }
    if (value?.buttonText) {
      this.mergedOptions.buttonText = { ...this._defaultOptions.buttonText, ...value.buttonText };
    }
  }

  get calendarOptions(): CalendarOptions {
    return this.mergedOptions;
  }
}
