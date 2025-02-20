/**
 * This is an extension for Xcratch.
 */

import iconURL from './entry-icon.png';
import insetIconURL from './inset-icon.svg';
import translations from './translations.json';

/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
let formatMessage = messageData => messageData.defaultMessage;

const entry = {
    get name () {
        return formatMessage({
            id: 'xcxWebChannel.entry.name',
            defaultMessage: 'Web Channel',
            description: 'name of the extension'
        });
    },
    extensionId: 'xcxWebChannel',
    extensionURL: 'https://yokobond.github.io/xcx-web-channel/dist/xcxWebChannel.mjs',
    collaborator: 'Yengawa Lab',
    iconURL: iconURL,
    insetIconURL: insetIconURL,
    get description () {
        return formatMessage({
            defaultMessage: 'Communicate with another project through the WebSocket.',
            description: 'Description for this extension',
            id: 'xcxWebChannel.entry.description'
        });
    },
    tags: ['network', 'web', 'communication', 'websocket'],
    featured: true,
    disabled: false,
    bluetoothRequired: false,
    internetConnectionRequired: false,
    helpLink: 'https://yokobond.github.io/xcx-web-channel/',
    setFormatMessage: formatter => {
        formatMessage = formatter;
    },
    translationMap: translations
};

export {entry}; // loadable-extension needs this line.
export default entry;
