# Web Channel
Inter project communication extension for [Xcratch](https://xcratch.github.io/)

This extension provides a "Web Channel" communication system that allows Scratch projects to interact with each other through WebSocket connections. 

The extension enables real-time communication between multiple Scratch projects running in different browsers or computers through a WebSocket server.

This extension uses [Web Channel Server](https://github.com/yokobond/xcx-web-channel-server) as a WebSocket server.


## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://yokobond.github.io/xcx-web-channel/projects/cat-fight-wc.sb3) to look at what you can do with "Web Channel" extension. 

This is a two-player battle game where:
- Open the project in two windows (can be on different PCs)
- Click the green flag to start
- Put channel name "cat-fight" in the input field and click "check" button
- Select your character by clicking on either cat 
- Use left/right arrow keys to move your character (movement syncs across both windows)
- Use up arrow key to attack
- Use down arrow key to defend

<iframe src="https://xcratch.github.io/editor/player#https://yokobond.github.io/xcx-web-channel/projects/cat-fight-wc.sb3" width="540px" height="460px"></iframe>


## Blocks Provided

This extension provides the following blocks:

### Channel Management
- Join channel with specified name on a server
- Leave channel 
- Report current server URI and channel name

### Data Sharing
- Set shared values with key-value pairs
- Get values by key

### Event System
- Send events with type and data
- Receive events from other connected projects
- Get last received event type and data


## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/). 
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field 
```
https://yokobond.github.io/xcx-web-channel/dist/xcxWebChannel.mjs
```
5. Click 'OK' button
6. Now you can use the blocks of this extension


## Development

### Install Dependencies

```sh
npm install
```

### Setup Development Environment

Change ```vmSrcOrg``` to your local ```scratch-vm``` directory in ```./scripts/setup-dev.js``` then run setup-dev script to setup development environment.

```sh
npm run setup-dev
```

### Bundle into a Module

Run build script to bundle this extension into a module file which could be loaded on Xcratch.

```sh
npm run build
```

### Watch and Bundle

Run watch script to watch the changes of source files and bundle automatically.

```sh
npm run watch
```

### Test

Run test script to test this extension.

```sh
npm run test
```


## 🏠 Home Page

Open this page from [https://yokobond.github.io/xcx-web-channel/](https://yokobond.github.io/xcx-web-channel/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yokobond/xcx-web-channel/issues). 
