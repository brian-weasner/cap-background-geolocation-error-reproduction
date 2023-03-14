import { SplashScreen } from '@capacitor/splash-screen';

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
          <button type="button" id="start-bg-geo" (click)="startBackgroundGeolocation()">Start</button>
          <button type="button" id="stop-bg-geo" (click)="stopBackgroundGeolocation()">Stop</button>
        </div>
        <hr/>
        <div>
          <button type="button" id="track-for-next-3-min" (click)="trackForNextNMinutes(3)">
            Track For Next 3 Minutes
          </button>
          <button type="button" id="clear-background-geo-schedule" (click)="clearBackgroundGeolocationSchedule()">
            Clear Schedule
          </button>
        </div>
        <hr/>
        <div>
          <button type="button" id="start-bg-geo-schedule" (click)="startBackgroundGeolocationSchedule()">
            Start Schedule
          </button>
          <button type="button" id="stop-bg-geo-schedule" (click)="stopBackgroundGeolocationSchedule()">
            Stop Schedule
          </button>
        </div>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      self.shadowRoot.querySelector('#start-bg-geo').addEventListener('click', async function (e) {
        console.log('Start Button clicked')
        // try {
        //   const photo = await Camera.getPhoto({
        //     resultType: 'uri',
        //   });

        //   const image = self.shadowRoot.querySelector('#image');
        //   if (!image) {
        //     return;
        //   }

        //   image.src = photo.webPath;
        // } catch (e) {
        //   console.warn('User cancelled', e);
        // }
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
