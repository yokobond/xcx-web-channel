export class WebChannelSession {

    /**
     * @param {string} channelName - The channel name to join
     * @param {WebSocket} socket - The socket to use
     * @constructor
     */
    constructor (channelName, socket) {

        /**
         * The channel socket
         * @type {WebSocket}
         */
        this.channel = socket;

        /**
         * channel name
         * @type {string}
         */
        this.channelName = channelName;

        /**
         * key and values received
         * @type {object}
         */
        this.values = {};

        /**
         * listeners for broadcast events
         * @type {Array<function>}
         */
        this.broadcastEventListeners = [];

        /**
         * last event received
         * @type {object}
         */
        this.lastEvent = null;

        this.channel.addEventListener('error', event => {
            this.onError(event.data);
        });
    }

    open () {
        if (!this.channel) {
            return Promise.reject(new Error('No channel'));
        }
        const connectionPromise = new Promise(resolve => {
            const socketReceiver = function (socketEvent) {
                const message = JSON.parse(socketEvent.data);
                if (message.action) {
                    console.info(`${message.topic}: ${message.action}=${message.message}`);
                    return;
                }
                this.onMessage(message);
            }.bind(this);
            const subscription = function (socketEvent) {
                const message = JSON.parse(socketEvent.data);
                if (message.action === 'subscribed' && message.message === 'success') {
                    console.info(`Subscribed to "${message.topic}"`);
                    this.channel.removeEventListener('message', subscription);
                    this.channel.addEventListener('message', socketReceiver);
                    resolve();
                }
            }.bind(this);
            this.channel.addEventListener('message', subscription);
            this.channel.send(
                JSON.stringify({
                    action: 'subscribe',
                    topic: this.channelName
                })
            );
        });
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Connection timeout after 3s'));
            }, 3000);
        });
        return Promise.race([connectionPromise, timeoutPromise])
            .catch(error => {
                this.close();
                throw error;
            });
    }

    /**
     * Closes the channel
     */
    close () {
        if (!this.channel) {
            return;
        }
        this.channel.close();
        this.channel = null;
    }

    processMessage (message) {
        switch (message.type) {
        case 'SET_VALUE':
            this.values[message.key] = message.value;
            break;
        case 'EVENT':
            this.lastEvent = message.data;
            this.notifyBroadcastEventListeners(this.lastEvent);
            break;
        default:
            console.error(`Unknown message type:${message.type}`);
            break;
        }
    }

    /**
     * Called when a message is received
     * @param {object} message - The message data
     */
    onMessage (message) {
        try {
            this.processMessage(message);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Called when an error occurs
     * @param {MessageEvent} err - The error
     */
    onError (err) {
        console.error(err);
    }

    /**
     * Adds a listener for broadcast events
     * @param {function} listener - The listener
     */
    addBroadcastEventListener (listener) {
        this.broadcastEventListeners.push(listener);
    }

    /**
     * Removes a listener for broadcast events
     * @param {function} listener - The listener
     */
    removeBroadcastEventListener (listener) {
        this.broadcastEventListeners = this.broadcastEventListeners.filter(l => l !== listener);
    }

    /**
     * Notifies all the listeners for broadcast events
     * @param {object} event - The event
     */
    notifyBroadcastEventListeners (event) {
        this.broadcastEventListeners.forEach(listener => {
            listener(event);
        });
    }

    /**
     * Sets a value for a key
     * @param {string} key - The key
     * @param {object} value - The value
     */
    setValue (key, value) {
        const message = {
            type: 'SET_VALUE',
            key: key,
            value: value
        };
        if (!this.channel) {
            return;
        }
        const payload = JSON.stringify({
            action: 'publish',
            topic: this.channelName,
            message: JSON.stringify(message)
        });
        this.channel.send(payload);
    }

    /**
     * Gets a value for a key
     * @param {string} key - The key
     * @returns {?object} The value
     */
    getValue (key) {
        return this.values[key];
    }

    /**
     * Broadcast an event that will be received by all the listeners
     * @param {string} type - The event type
     * @param {object} data - The event data
     * @returns {void}
     */
    broadcastEvent (type, data) {
        const message = {
            type: 'EVENT',
            data: {
                type: type,
                data: data
            }
        };
        if (!this.channel) {
            return;
        }
        const payload = JSON.stringify({
            action: 'publish',
            topic: this.channelName,
            message: JSON.stringify(message)
        });
        this.channel.send(payload);
    }
}
