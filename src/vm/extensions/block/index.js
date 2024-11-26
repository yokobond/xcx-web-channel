import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import log from '../../util/log';
import translations from './translations.json';
import blockIcon from './block-icon.png';
import {WebChannelSession} from './web-channel-session';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.default;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'xcxWebChannel';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/xcx-web-channel/dist/xcxWebChannel.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
        if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'xcxWebChannel.name',
            default: 'Web Channel',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for Web Channel.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        /**
         * The channel session.
         * @type {?WebChannelSession}
         */
        this.channelSession = null;

        /**
         * Local value holder when the channel is not connected.
         * @type {object<string, string>}
         */
        this.channelValues = {};

        /**
         * Local event holder when the channel is not connected.
         * @type {object}
         */
        this.lastChannelEvent = null;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'joinChannel',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxWebChannel.joinChannel',
                        default: 'join channel [CHANNEL] on server [URI]'
                    }),
                    func: 'joinChannel',
                    arguments: {
                        CHANNEL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.joinChannel.defaultChannel',
                                default: ' '
                            })
                        },
                        URI: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.joinChannel.defaultURI',
                                default: 's1.yengawa.com/wc'
                            })
                        }
                    }
                },
                {
                    opcode: 'reportServerURI',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxWebChannel.reportServerURI',
                        default: 'server'
                    }),
                    func: 'reportServerURI'
                },
                {
                    opcode: 'reportChannelName',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxWebChannel.reportChannelName',
                        default: formatMessage({
                            id: 'xcxWebChannel.reportChannelName',
                            default: 'channel name'
                        })
                    }),
                    func: 'reportChannelName',
                    arguments: {}
                },
                {
                    opcode: 'leaveChannel',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxWebChannel.leaveChannel',
                        default: 'leave channel'
                    }),
                    func: 'leaveChannel',
                    arguments: {}
                },
                '---',
                {
                    opcode: 'setValue',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxWebChannel.setValue',
                        default: 'set value of [KEY] to [VALUE]',
                        description: 'set value of the key'
                    }),
                    func: 'setValue',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.setValue.defaultKey',
                                default: 'key'
                            })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.setValue.defaultValue',
                                default: 'value'
                            })
                        }
                    }
                },
                {
                    opcode: 'valueOf',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxWebChannel.valueOf',
                        default: 'value of [KEY]'
                    }),
                    func: 'valueOf',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.valueOf.defaultKey',
                                default: 'key'
                            })
                        }
                    }
                },
                '---',
                {
                    opcode: 'sendEvent',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'xcxWebChannel.sendEvent',
                        default: 'send event [TYPE] with [DATA]'
                    }),
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.sendEvent.defaultEvent',
                                default: 'event'
                            })
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxWebChannel.sendEvent.defaultData',
                                default: 'data'
                            })
                        }
                    }
                },
                {
                    opcode: 'whenEventReceived',
                    blockType: BlockType.EVENT,
                    text: formatMessage({
                        id: 'xcxWebChannel.whenEventReceived',
                        default: 'when event received'
                    }),
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: false
                },
                {
                    opcode: 'lastEventType',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxWebChannel.lastEventType',
                        default: 'event'
                    })
                },
                {
                    opcode: 'lastEventData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxWebChannel.lastEventData',
                        default: 'data of event'
                    }),
                    arguments: {
                    }
                }
            ],
            menus: {
            }
        };
    }

    /**
     * Connect to the server.
     * @param {object} args - arguments for the block.
     * @param {string} args.CHANNEL - the channel name.
     * @param {string} args.URI - the URI of the server.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise<string>} - resolve with the result of connecting to the server.
     */
    joinChannel (args, util) {
        const channel = Cast.toString(args.CHANNEL).trim();
        const uri = Cast.toString(args.URI).trim();
        if (this.serverSocket && (this.serverURI === uri)) {
            return Promise.resolve(`already connected: ${uri}`);
        }
        if (this.isConnecting) {
            if (util) {
                util.yield();
            }
            return;
        }
        this.isConnecting = true;
        if (this.channelSession) {
            this.leaveChannel();
        }
        const connectionPromise = new Promise((resolve, reject) => {
            const socket = new WebSocket(`wss://${uri}`);
            socket.addEventListener('open', () => {
                this.serverSocket = socket;
                this.serverURI = uri;
                socket.addEventListener('close', () => {
                    this.leaveChannel();
                    log.info(`WebSocket closed: ${uri}`);
                });
                socket.addEventListener('error', error => {
                    log.error(`WebSocket error: ${error.message}`);
                });
                this.channelSession = new WebChannelSession(channel, socket);
                this.channelSession.addBroadcastEventListener(this.onEvent.bind(this));
                this.channelSession.open()
                    .then(() => {
                        log.info(`WebSocket connected: ${uri}`);
                        resolve(`connected to "${this.channelSession.channelName}" on "wss://${uri}"`);
                    })
                    .catch(error => {
                        this.leaveChannel();
                        reject(error);
                    });
            });
        });
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('WebSocket connection timeout after 10s'));
            }, 10000);
        });
        return Promise.race([connectionPromise, timeoutPromise])
            .catch(error => {
                this.leaveChannel();
                log.error(`joinChannel: ${error.message}`);
                return error.message;
            })
            .finally(() => {
                this.isConnecting = false;
            });
    }

    /**
     * Disconnect from the server.
     */
    disconnectServer () {
        if (!this.serverSocket) {
            return;
        }
        if (
            (this.serverSocket.readyState !== WebSocket.CLOSED) &&
            (this.serverSocket.readyState !== WebSocket.CLOSING)) {
            this.serverSocket.close();
        }
        this.serverSocket = null;
        const serverURI = this.serverURI;
        this.serverURI = null;
        log.info(`WebSocket disconnected: ${serverURI}`);
    }

    /**
     * Return the server URI.
     * @return {string} - the server URI.
     */
    reportServerURI () {
        return this.serverURI ? this.serverURI : '';
    }

    /**
     * Leave the current channel.
     * @return {string} - the result of leaving the channel.
     */
    leaveChannel () {
        if (!this.channelSession) {
            return 'no channel joined';
        }
        const channelName = this.channelSession.channelName;
        this.channelSession.close();
        this.channelSession = null;
        this.disconnectServer();
        return `left from ${channelName}`;
    }

    /**
     * Return the channel name.
     * @return {string} - the channel name.
     */
    reportChannelName () {
        return this.channelSession ? this.channelSession.channelName : '';
    }

    /**
     * Return the value of the key.
     * @param {object} args - arguments for the block.
     * @param {string} args.KEY - the key.
     * @return {string} - the value of the key.
     */
    valueOf (args) {
        const key = String(args.KEY).trim();
        if (!this.channelSession) {
            return this.channelValues[key] ? this.channelValues[key] : '';
        }
        const value = this.channelSession.getValue(key);
        if (typeof value === 'undefined') {
            return '';
        }
        this.channelValues[key] = value;
        return value;
    }

    /**
     * Set the value of the key.
     * @param {object} args - arguments for the block.
     * @param {string} args.KEY - the key.
     * @param {string} args.VALUE - the value.
     * @return {string} - the result of setting the value.
     */
    setValue (args) {
        const key = String(args.KEY).trim();
        const value = Cast.toString(args.VALUE);
        log.debug(`setValue: ${key} = ${value}`);
        if (!this.channelSession) {
            this.channelValues[key] = value;
            return Promise.resolve(`local ${key} = ${value}`);
        }
        try {
            this.channelSession.setValue(key, value);
        } catch (error) {
            return error.message;
        }
        // resolve after a delay to process another message when this block is used in a loop.
        return Promise.resolve(`published ${key} = ${value}`);
    }

    /**
     * Handle the event.
     * @param {object} event - the event.
     */
    onEvent (event) {
        this.lastChannelEvent = event;
        this.runtime.startHats('xcxWebChannel_whenEventReceived');
    }

    /**
     * Return the last event type.
     * @return {string} - the last event type.
     */
    lastEventType () {
        const event = this.lastChannelEvent;
        return event ? event.type : '';
    }

    /**
     * Return the last event data.
     * @return {string} - the last event data.
     */
    lastEventData () {
        const event = this.lastChannelEvent;
        return event ? event.data : '';
    }

    /**
     * Send the event.
     * @param {object} args - arguments for the block.
     * @param {string} args.TYPE - the event type.
     * @param {string} args.DATA - the event data.
     * @return {Promise<string>} - resolve with the result of sending the event.
     */
    sendEvent (args) {
        const type = String(args.TYPE).trim();
        const data = Cast.toString(args.DATA);
        if (!this.channelSession) {
            this.onEvent({type: type, data: data});
            return Promise.resolve(`local event: ${type} data: ${data}`);
        }
        try {
            this.channelSession.broadcastEvent(type, data);
        } catch (error) {
            return Promise.resolve(error.message);
        }
        // resolve after a delay for the broadcast event to be received.
        return Promise.resolve(`published event: ${type} data: ${data}`);
    }
}

export {ExtensionBlocks as default, ExtensionBlocks as blockClass};
