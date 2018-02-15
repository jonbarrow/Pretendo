const MII_DATA = 'AwAAQCJAGKQgBPBg15xMMuQfAKuusgAA+ENQAHIAZQB0AGUAbgBkAG8AMgAAAF8aAAAhAQJoRBgm\r\nNEYUgRIXaA0AACkAUkhQTQBhAHIAaQBvAAAAAAAAAAAAAAAAAKAp';
// Mii data from Pretendo test account

let Mii = require('./mii.class'), // Require class
    MiiHandler = new Mii(MII_DATA); // Feed it data

console.log(MiiHandler.decode()); // Get JSON. Woot!

// Now to rip assets and start rendering