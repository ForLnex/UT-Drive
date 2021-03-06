"use strict";

var fs    = require("fs"),
    path  = require("path"),
    chalk = require("chalk"),
    log   = require("./log.js"),
    config,
    defaults = [
        '{',
        '    "debug"        : false,',
        '    "useTLS"       : false,',
        '    "useSPDY"      : false,',
        '    "useHSTS"      : false,',
        '    "listenHost"   : "0.0.0.0",',
        '    "listenPort"   : 8989,',
        '    "readInterval" : 250,',
        '    "keepAlive"    : 20000,',
        '    "linkLength"   : 3,',
        '    "logLevel"     : 2,',
        '    "maxOpen"      : 256,',
        '    "maxFileSize"  : 0,',
        '    "zipLevel"     : 1,',
        '    "noLogin"      : false,',
        '    "demoMode"     : false,',
        '    "timestamps"   : true,',
        '    "db"           : "./db.json",',
        '    "filesDir"     : "./files/",',
        '    "incomingDir"  : "./temp/incoming/",',
        '    "resDir"       : "./res/",',
        '    "srcDir"       : "./src/",',
        '    "tls" : {',
        '        "key"       : "./key.pem",',
        '        "cert"      : "./cert.pem",',
        '        "ca"        : []',
        '    }',
        '}'
    ].join("\n");

module.exports = function (configFile) {
    // Read & parse config.json, create it if necessary
    try {
        fs.statSync(configFile);
        config = JSON.parse(fs.readFileSync(configFile));
    } catch (error) {
        if (error.code === "ENOENT") {
            log.useTimestamp = true; // For consistent logging, set this to true as in the default config
            log.simple("Creating ", chalk.magenta(path.basename(configFile)), "...");
            fs.writeFileSync(configFile, defaults);
        } else {
            log.error("Error reading ", configFile, ":\n", error);
            process.exit(1);
        }
    }

    // Add any missing options
    if (!config) config = {};
    defaults = JSON.parse(defaults);
    config = mergeDefaults(config, defaults);
    fs.writeFileSync(configFile, JSON.stringify(config, null, 4));

    // Change relative paths to absolutes during runtime
    ["db", "filesDir", "incomingDir", "resDir", "srcDir"].forEach(function (prop) {
        if (config[prop][0] === ".") {
            config[prop] = path.join(process.cwd() + config[prop].substring(1));
        }
    });
    ["cert", "key", "ca"].forEach(function (prop) {
        if (config.tls[prop][0] === ".") {
            config.tls[prop] = path.join(process.cwd() + config.tls[prop].substring(1));
        }
    });

    // Special config for droppy's demo
    if (process.env.NODE_ENV === "droppydemo") {
        log.simple("Loading demo mode configuration...");
        return {
            "debug"        : false,
            "useTLS"       : false,
            "useSPDY"      : false,
            "useHSTS"      : false,
            "listenHost"   : "0.0.0.0",
            "listenPort"   : process.env.PORT || 8989,
            "readInterval" : 250,
            "keepAlive"    : 20000,
            "linkLength"   : 3,
            "logLevel"     : 3,
            "maxOpen"      : 256,
            "zipLevel"     : 1,
            "demoMode"     : true,
            "noLogin"      : true,
            "timestamps"   : false,
            "db"           : "./db.json",
            "filesDir"     : "./files/",
            "incomingDir"  : "./temp/incoming/",
            "resDir"       : "./res/",
            "srcDir"       : "./src/",
            "tls" : {
                "key"      : "",
                "cert"     : "",
                "ca"       : "",
            }
        };
    } else {
        return config;
    }
};

function mergeDefaults(options, defaults) {
    Object.keys(defaults).forEach(function (p) {
        try {
            if (typeof defaults[p] === "object" && !Array.isArray(defaults[p])) {
                options[p] = mergeDefaults(options[p], defaults[p]);
            } else if (options[p] === undefined) {
                options[p] = defaults[p];
            }
        } catch (e) {
            options[p] = defaults[p];
        }
    });
    return options;
}
