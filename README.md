#UT-Drive
A personal cloud storage solution built on top of Silverwind's droppy project, with a speedy HTML5 interface, running on [node.js](http://nodejs.org/).

####Demos available: [Demo #1](drive.jbury.us) (Log in with test:test)

![Main View](http://i.imgur.com/izxnfAN.png)
![Editor](http://i.imgur.com/Ziv79rJ.png)
![Images](http://i.imgur.com/h7tfXkU.png)

###Features
* Lightweight. Performs great, even on a Raspberry Pi.
* Fully responsive, mobile-ready CSS.
* Realtime updating of all connected clients via WebSockets.
* Asynchronous multi-file uploads. Recursive directory uploads in Chrome.
* Download directories as ZIPs.
* Edit text files in CodeMirror, a feature-rich editor.
* Basic file system operations: Cut, Copy, Rename, Delete, Create directory.
* Drag and Drop support for uploads and filesystem operations. CTRL/CMD to copy, Shift to move.
* Playback of audio files supported by the [`<audio>` API](https://developer.mozilla.org/en-US/docs/HTML/Supported_media_formats#Browser_compatibility).
* Support for shortened links to share file downloads with your friends without them needing to log in.

##Installation
Currently the only way to install UT-Drive is to clone the repo and run npm install.

##Running the server
Inside UT-Drives's directory run:
````bash
sudo node drive
````
By default, the server will listen on [port 8989](http://localhost:8989/). On first startup, you'll be prompted for a username and password for your first account. To list, add or remove accounts, either use the configuration dialog or see `node drive help`.

##Configuration
Configuration is done through `config.json`, which is created on the first run, with these defaults:
````javascript
{
    "debug"        : false,
    "useTLS"       : false,
    "useSPDY"      : false,
    "useHSTS"      : false,
    "listenHost"   : "0.0.0.0",
    "listenPort"   : 8989,
    "readInterval" : 250,
    "keepAlive"    : 20000,
    "linkLength"   : 3,
    "logLevel"     : 2,
    "maxOpen"      : 256,
    "maxFileSize"  : 0,
    "zipLevel"     : 1,
    "noLogin"      : false,
    "demoMode"     : false,
    "timestamps"   : true,
    "db"           : "./db.json",
    "incomingDir"  : "./temp/incoming/",
    "resDir"       : "./res/",
    "srcDir"       : "./src/",
    "tls" : {
        "key"      : "./key.pem",
        "cert"     : "./cert.pem",
        "ca"       : []
    }
}
````
###General options
- `debug`: Skip resource minification and enable automatic CSS reloading when the source files change.
- `useTLS`: Whether the server should use SSL/TLS encryption.
- `useSPDY`: Enables the SPDYv3 protocol. Depends on `useTLS`.
- `useHSTS`: Enables the [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) header with 1 year caching time. Depends on `useTLS`.
- `listenHost`: The host address to listen on.
- `listenPort`: The port to listen on.
- `readInterval`: The minimum time gap in milliseconds in which updates to a single directory are sent.
- `keepAlive`: The interval in milliseconds in which the server sends keepalive message over the websocket. This obviously adds some overhead, but may be needed to keep clients connected when proxies are involved. Set to `0` to disable keepalive messages.
- `linkLength`: The amount of characters in a shortlink.
- `logLevel`: The amount of logging to show. `0` is no logging, `1` is errors, `2` is info ( HTTP requests), `3` is debug (socket communication).
- `maxOpen`: The maximum number of concurrently opened files. This number is primarily of concern for Windows servers.
- `maxFileSize`: The maximum file size in bytes a user can upload in a single file.
- `zipLevel`: The level of compression for zip files. Ranging from 0 (no compression) to 9 (maximum compression).
- `noLogin`: When enabled, the client skips the login page, making the server essentially public.
- `demoMode`: When enabled, the server will regularly clean out all files and restore samples.
- `timestamps`: Adds timestamps to log output. Useful if your logging facility does not provide timestamps.

###Path options
- `db`: Location of the database file.
- `incomingDir`: The directory for temporary files during uploads.
- `resDir`: The directory which contains the compiled resources and images.
- `srcDir`: The directory which contains the html/js/css sources.
- `tls`: See TLS options below.

###TLS options
These paths are passed directly to [node's tls](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) when `useTLS` is enabled. All files are required in PEM format.

- `key`: Path to your private key.
- `cert`: Path to your certificate.
- `ca`: An optional array of paths to your intermediate (CA) certificates.

##Supported Browsers
- Firefox (last 2 versions)
- Chrome (last 2 versions)
- Internet Explorer 10 or higher (not regularly tested)

In case of Firefox and Chrome older version may still work, but I'm not targeting CSS code at them.
