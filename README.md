# RiiU

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

## The aim of this project is to prepare for the WiiU (and possibly 3DS, as they share many API endpoints) EOL (End of Life). Hopefully these will allow for custom servers in the (distant) future. I will be attempting to clone the functionality of every system and game service/server endpoint that I can. Though with limited knowledge and not access to every game this will be a difficult, if not impossible task to do alone.

# What is this useful for?
1. Preservation - The WiiU, just like every console, has an EOL (End of Life). There will be a point when Nintendo shuts down all the WiiU system, service, and game servers that the WiiU depends on for many features. One of the goals with this project is to keep the WiiU alive, and to prepare for the EOL.
2. Customization - With a custom server you have full control. Nintendo currently enforces certain things which may not be desirable to all (for example, requiring console-specific information to login and use services, as official accounts are tied to consoles). This could also become useful for tools like Cemu, which currently supports online play but requires dumps of console-specific files to get online (as, again, official accounts are tied to consoles). Custom servers could remove this barrier and allow anyone to go online with Cemu.

# Cool! How far along is it?
Not far at all. Currently only a few basic endpoints are implemented, and a few of them not to completion (see below). There is also the issue of Nintendo using UDP/PRUDP for all online games, like MK8 or SMM, and a few system services, like the friends system. I have little experience with UDP in general let alone a custom layer on top of it. I am looking for people to help me in those areas, as alone I will probably never get them done.

# How do I get it running and connect my WiiU?
### Setup:
1. Download [NodeJS](https://nodejs.org/en/)
2. Clone this repo or [download the source](https://github.com/RedDuckss/RiiU/archive/master.zip)
3. Open a terminal/command prompt of any kind and enter the repo
4. Enter the folder for whatever server you want online
5. Run `npm i` in the terminal/command prompt to install all the depends
6. Run `node server.js` to start the server
### Connect
There are several ways to do this. Proxy server, NAND patch, etc. In my case, I used Fiddler (my tool for sniffing packets) and used it to also act as a server proxy.
1. Make sure you have [Homebrew](https://wiiu.guide/) installed and working with Mocha CFW
2. Install FTPiiU_Everywhere (NOT THE REGULAR FTPiiU!)
3. Download and install FiddlerProxy on your PC
4. In Fiddler, open `Tools > Options`
5. In the `HTTPS` tab turn on HTTPS Connects
5. Enable HTTPS decrypting
6. Ignore server certificate errors
7. In the `Connections` tab tick `Allow remote computers to connect`
8. Turn off `Act as system proxy on startup`
9. Back in the `HTTPS` tab click `Actions > Export Root Certificate to Desktop`
10. Rename `FiddlerRoot.cer` to `CACERT_NINTENDO_CA_G3.der`
11. In your WiiU launch in to Mocha (redNAND or sysNAND, doesn't matter. Do which ever you want)
12. Launch the Homebrew Launcher and startup FTPiiU_Everywhere
13. Connect to the FTP server on your PC (I use WinSCP)
14. Go to `/vol/storage_mlc01/sys/title/0005001b/10054000/content/`
15. Dump the `ccerts` folder to your PC (Will be used later. The file we will be using is common to ALL WiiU consoles, so you can download this file online if you do not have a WiiU)
16. Enter `scerts` and replace the `CACERT_NINTENDO_CA_G3.der` file there with the `CACERT_NINTENDO_CA_G3.der` file we just made from the FiddlerRoot.cer
17. Close the FTP connection on your PC and exit FTPiiU_Everywhere (press Home button)
18. Reboot your console (DO NOT FORCE REBOOT (holding power button for 4 seconds)! REBOOT NORMALLY! FORCE REBOOTING CAN SOMETIMES ERASE CHANGES!)
19. Go to the connection settings for your WiFi connection on your WiiU and turn on proxy connections
20. Set the proxy server to your PC's IP, and the port to `8888` (unless you changed the Fiddler port)
21. On your PC go to wher you dumped `ccerts` and copy `WIIU_COMMON_1_CERT.der` (again, this file is common to all consoles. You can find it online if you don't have a WiiU)
22. Paste the cert in `%USERPROFILE%\My Documents\Fiddler2\` and rename it to `ClientCertificate.cer`
23. Open the `FiddlerScript` section of the Fiddler UI and find the `OnBeforeRequest` method
24. At the end of the method, add:
```
// Change "account.nintendo.net" to whatever server you are replacing
if (oSession.HostnameIs("account.nintendo.net"))
{
    if (oSession.HTTPMethodIs("CONNECT"))
    {
        // This is just a fake tunnel for CONNECT requests
        oSession["x-replywithtunnel"] = "RiiUTunnel";
        return;
    }

    // Change "http://account.riiu.net" to your custom WiiU server address
    oSession.fullUrl = "http://account.riiu.net" + oSession.PathAndQuery;
}
```
25. Restart Fiddler to apply changes

You should now see traffic from your WiiU flow into Fiddler, and be proxied to your custom server

# Currently implemented endpoints:
- [GET] https://account.nintendo.net/v1/api/devices/@current/status
- [GET] https://account.nintendo.net/v1/api/content/agreements/TYPE/REGION/VERSION (partly, need help<sup id="a1">[1](#f1)</sup>)
- [GET] https://account.nintendo.net/v1/api/content/time_zones/REGION/LANGUAGE
- [GET] https://account.nintendo.net/v1/api/people/USERNAME
- [POST] https://account.nintendo.net/v1/api/support/validate/email
- [POST] https://account.nintendo.net/v1/api/people (PARTLY! NEED HELP!<sup id="a3">[3](#f3)</sup>)



### Footnotes

<b id="f1">1</b> I do not know what other `TYPE`'s there are. I currently only know of one, `Nintendo-Network-EULA`, I still am unsure as to when I should throw error `1102` and I lack the remaining data for the rest of the EULA agreements. [↩](#a1)

~~<b id="f2">2</b> I simply lack the rest of the timezone lists.~~

<b id="f3">3</b> There are MANY values that Nintendo seems to generate on their servers. I have no idea what some of these values mean and where/how they are used. Because of this I am unsure how to properly generate these values, and I am using placeholder values instead! (see here for an example of what the return for an account is https://github.com/RedDuckss/csms/blob/master/OFFICIAL_SCHEMA.md#grab-profile)

The entire `accounts` section at the beginning is new, and not sent by the registration request. It seems to have something to do with eShop accounts, though I don't know what exactly. I went to the eShop and it never even makes a request to that endpoint so the eShop isn't using that data, yet it's the only "account" mentioned. I am also unsure as to what `active_flag` is used for. There are also several `id` fields that seem completely pointless, like the `id` field in the `email` section and how the `mii` has it's own `id`, as do each of the different `mii_image` fields. [↩](#a3)

