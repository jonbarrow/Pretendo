let mailer = require('./mailer');

mailer.send(
    'halolink44@gmail.com',
    '[RiiU Network] Please confirm your e-mail address',
    `Hello,

    Your RiiU Network ID activation is almost complete.  Please click the link below to confirm your e-mail address and complete the activation process.
    
    id.riiu.net/account/email-confirmation?token=token
    
    If you are unable to connect to the above URL, please enter the following confirmation code on the device to which your RiiU Network ID is linked.
    
    <<Confirmation code: code>>`
);