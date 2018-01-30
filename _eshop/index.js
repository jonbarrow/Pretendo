//////////////////////////////////////////////////////////////////
///                                                            ///
///                        Dependencies                        ///
///                                                            ///
//////////////////////////////////////////////////////////////////

let port = 80,
    path = require('path'),
    express = require('express'),
    colors = require('colors'),
    app = express();

app.get('/', (request, response) => {
    response.end('Lmao this is gonna suck to recreate');
});

// Starts the server
app.listen(port, () => {
    console.log('Server'.blue + ' started '.green.bold + 'on port '.blue + new String(port).yellow);
});