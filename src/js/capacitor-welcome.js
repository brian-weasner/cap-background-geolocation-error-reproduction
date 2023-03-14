import { SplashScreen } from '@capacitor/splash-screen';
import { BgGeoService } from './bg-geo-service';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Capacitor</h1>
      </capacitor-welcome-titlebar>
      <main>
        <h2>Demo Bg Geo</h2>
        <div>
          <button type="button" id="start-bg-geo">Start</button>
          <button type="button" id="stop-bg-geo">Stop</button>
        </div>
        <hr/>
        <div>
          <button type="button" id="track-for-next-3-min" (click)="trackForNextNMinutes(3)">
            Track For Next 3 Minutes
          </button>
          <button type="button" id="clear-background-geo-schedule">
            Clear Schedule
          </button>
        </div>
        <hr/>
        <div>
          <button type="button" id="start-bg-geo-schedule">
            Start Schedule
          </button>
          <button type="button" id="stop-bg-geo-schedule">
            Stop Schedule
          </button>
        </div>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      const bgGeoSvc = new BgGeoService();

      self.shadowRoot.querySelector('#start-bg-geo').addEventListener('click', () => {
        console.log('Start Button Clicked');
        bgGeoSvc.start().catch(_ => console.error('Click Handler Catch:', _));
      });
      self.shadowRoot.querySelector('#stop-bg-geo').addEventListener('click', () => {
        console.log('Stop Button Clicked');
        bgGeoSvc.stop().catch(_ => console.error('Click Handler Catch:', _));
      });

      self.shadowRoot.querySelector('#track-for-next-3-min').addEventListener('click', () => {
        const minutesToTrackFor = 3;
        console.log(`Track for Next ${minutesToTrackFor} Min Button Clicked`);

        const currentDateTime = new Date();
        const inNMinutes = new Date();
        inNMinutes.setMinutes(inNMinutes.getMinutes() + minutesToTrackFor);

        const getDateInScheduleFormat = (date) => {
          // yyyy-MM-dd-HH:mm
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
        }

        const scheduleItemString = `${getDateInScheduleFormat(currentDateTime)} ${getDateInScheduleFormat(inNMinutes)}`;

        bgGeoSvc.addScheduleItem(scheduleItemString).then(() => {
          console.log('Make sure to start geolocation schedule for scheduled tracking to start.');
        }).catch(_ => console.error('Click Handler Catch:', _))
      });
      self.shadowRoot.querySelector('#clear-background-geo-schedule').addEventListener('click', () => {
        console.log('Clear Schedule Button Clicked');
        bgGeoSvc.clearSchedule().catch(_ => console.error('Click Handler Catch:', _));
      });


      self.shadowRoot.querySelector('#start-bg-geo-schedule').addEventListener('click', () => {
        console.log('Start Schedule Button Clicked');
        bgGeoSvc.startSchedule().catch(_ => console.error('Click Handler Catch:', _));
      });
      self.shadowRoot.querySelector('#stop-bg-geo-schedule').addEventListener('click', () => {
        console.log('Stop Schedule Button Clicked');
        bgGeoSvc.stopSchedule().catch(_ => console.error('Click Handler Catch:', _));
      });
    }
  }
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  }
);
