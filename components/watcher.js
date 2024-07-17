const aframeWatcher = require('aframe-watcher');

aframeWatcher.watch({
    entry: './main.js',   // Entry point for your JS file
    output: './main.js', // Output file (same file in this case)
    clear: true, // Clear the console on reload
    debounce: 300, // Delay in ms before reloading after a change
});
