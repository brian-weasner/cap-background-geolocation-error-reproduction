import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

export class BgGeoService {
    /**
       * This is the config for the TransistorSoft Background Geolocation.
       * On **First Install** and use this is the value that gets set within the plugin.
       * On **Subsequent Launches** of the app, this will override configuration (for the properties with values provided) that was set on first use.
       *
       * @type {Config}
       * @private
       */
    INIT_CONFIG = {
        // Plugin Config
        reset: false,                  // <-- Setting to false allows the BackgroundGeolocation to re-apply its persisted configuration (Makes it not clear out schedule and other config data when ready is called). We handle updating the config with the values set in INIT_CONFIG after ready. So that if INIT_CONFIG values change, the config is set without resetting peristed values.
        // Location Settings
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        stopOnTerminate: false,        // <-- Setting to false allows the background-service to continue tracking when user closes the app.
        startOnBoot: true,             // <-- Auto start tracking when device is powered-up.
        foregroundService: true,       // <-- Help Android from killing the app if running
        // Schedule Tracking
        // schedule                    // <-- Do not set `schedule` property (even as undefined), so that on ready we do not overwrite any existing schedules from previous launch
        scheduleUseAlarmManager: true, // <-- Force the Android scheduler to use AlarmManager (more precise) instead of JobScheduler
        // HTTP / SQLite config
        batchSync: false,              // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true,                // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {},                   // <-- HTTP Headers
        params: {},                    // <-- Optional HTTP params append to each HTTP request
        // extras                      // <-- Do not set `extras` property (even as undefined), so that on ready we do not overwrite any existing extra data from previous launch. Extras is an object of optional meta-data appended to each recorded location.
        maxDaysToPersist: 3,           // <-- Maximum number of days to persist offline/unsuccessfully sent location data - Same as Timestream's Memory store retention
        // Location Notification
        notification: {
            channelName: 'Driver Location Tracking',
            smallIcon: "drawable/location_notification_icon"
        },
        // Permissions
        backgroundPermissionRationale: {
            title: 'Location Services Required',
            message: `Enable location permission, and set to {backgroundPermissionOptionLabel}. This is required so that the app can track your location`
        },
        // iOS will prompt for location permission we want.
        locationAuthorizationRequest: 'Always',
        disableLocationAuthorizationAlert: true // We handle routing the user to the settings page for both ios and android
    }

    constructor() {
        this.initializePromise = this.initialize();
        this.initializePromise.catch((err) => {
            // Swallow error, so not "uncaught"
        });
    }

    async initialize() {
        try {
            // Initial Config Setup
            const config = {
                ...this.INIT_CONFIG, // Create from INIT_CONFIG Value
                debug: true, // Generally config/env based
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // Generally config/env based.
                // Generally set url and authorization here.
            };

            // Call Background Geolocation Ready Fn. (SHOULD ONLY BE CALLED ONCE PER APP!)
            // Call setConfig if you need to change the configuration after ready has been called.
            this.log(`Initialize => Make Ready`);
            const readyState = await BackgroundGeolocation.ready(config);
            // Do not log Authorization to debug log
            this.log(`Initialized Background Geolocation Plugin, State On Ready: ${JSON.stringify({
                ...readyState,
                authorization: undefined
            })}`);
            this.log(`Updating Config with set values from INIT_CONFIG`);
            // This allows us to make sure that any changes made to INIT_CONFIG will override current state from ready
            const afterInitConfigOverrides = await BackgroundGeolocation.setConfig({
                ...readyState,
                ...config
            });
            // Do not log Authorization to debug log
            this.log(`Config Updated with INIT_CONFIG values: ${JSON.stringify({
                ...afterInitConfigOverrides,
                authorization: undefined
            })}`);

            // Normally listen to authorization changes and update config here.
            // Normally listen to permission changes here.
        } catch (error) {
            this.log(`Initialize => Errored: ${error.toString()}`);
            throw error;
        }
    }

    /**
       * Starts Background Geolocation Tracking
       * Will start sending location data to the apiEndpoint defined in mobileConfig.backgroundGeolocation
       *
       * @returns {Promise<void>}
       */
    async start() {
        this.log(`Start Called`);
        await this.initializePromise;

        try {
            let state = await BackgroundGeolocation.getState();
            if (!state.enabled) {
                state = await BackgroundGeolocation.start();
                if (!state.enabled) {
                    throw new Error('Tracking Not Enabled');
                }
            }
        } catch (error) {
            this.log(`Start => Errored : ${error.message}`);
            throw error;
        }
    }

    /**
     * Stops Background Geolocation Tracking
     * @returns {Promise<void>}
     */
    async stop() {
        this.log(`Stop Called`);
        await this.initializePromise;

        try {
            let state = await BackgroundGeolocation.getState();
            if (state.enabled) {
                this.log(`Stop => Stop`);
                state = await BackgroundGeolocation.stop();
                if (state.enabled) {
                    throw new Error('Tracking Still Enabled');
                }
            }
        } catch (error) {
            this.log(`Stop => Errored : ${error.message}`);
            throw error;
        }
    }


    async startSchedule() {
        this.log(`Start Schedule Called`);
        await this.initializePromise;

        try {
            let state = await BackgroundGeolocation.getState();
            if (!state.schedulerEnabled) {
                // Do not log Authorization to debug log
                this.log(`Starting Schedule. Current State: ${JSON.stringify({ ...state, authorization: undefined })}`);
                state = await BackgroundGeolocation.startSchedule();
                // Do not log Authorization to debug log
                this.log(`Schedule Started. Current State: ${JSON.stringify({ ...state, authorization: undefined })}`);
                if (!state.schedulerEnabled) {
                    // Get logs from 4 min ago till now.
                    const backgroundGeolocationLogs = await BackgroundGeolocation.logger.getLog({
                        start: new Date().getTime() - (5 * 60 * 1_000),
                        end: new Date().getTime()
                    });
                    // Want this logged every time as we are currently having issues with ios devices not starting the scheduler.
                    this.log(backgroundGeolocationLogs);
                    throw new Error('Scheduler Failed To Start');
                }
            }
        } catch (error) {
            this.log(`Start Schedule => Errored : ${error.message}`);
            throw error;
        }
    }

    /**
     * Stops Background Geolocation Scheduled Tracking
     * @returns {Promise<void>}
     */
    async stopSchedule() {
        this.log(`Stop Schedule Called`);
        await this.initializePromise;

        try {
            let state = await BackgroundGeolocation.getState(); // State extends Config.
            if (state.schedulerEnabled) {
                this.log(`Stop Schedule => Stop Schedule`);
                state = await BackgroundGeolocation.stopSchedule();
                if (state.schedulerEnabled) {
                    throw new Error('Scheduler Failed To Stop');
                }
            }
        } catch (error) {
            this.log(`Stop Schedule => Errored : ${error.message}`);
            throw error;
        }
    }


    async clearSchedule() {
        this.log(`Clear Schedule Called`);
        await this.initializePromise;

        try {
            let currentConfig = await BackgroundGeolocation.getState(); // State extends Config.
            if (currentConfig.schedule && currentConfig.schedule.length > 0) {
                this.log(`Clearing Schedule`);
                currentConfig.schedule = [];
                currentConfig = await BackgroundGeolocation.setConfig(currentConfig);
                return currentConfig.schedule;
            }
            return currentConfig.schedule;
        } catch (error) {
            this.log(`Clear Schedule => Errored : ${error.message}`);
            throw error;
        }
    }

    async addScheduleItem(newScheduleItemString) {
        this.log(`Add Schedule Called`);
        await this.initializePromise;

        try {
            let currentConfig = await BackgroundGeolocation.getState(); // State extends Config.
            currentConfig.schedule = [
                ...(currentConfig.schedule ?? []),
                newScheduleItemString
            ];
            this.log(`Add Schedule => Adding: "${newScheduleItemString}"`);
            currentConfig = await BackgroundGeolocation.setConfig(currentConfig);
            return currentConfig.schedule;
        } catch (error) {
            this.log(`Add Schedule => Errored : ${error.message}`);
            throw error;
        }
    }



    log(stringVal) {
        console.log(stringVal);
    }
}
