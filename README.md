# nintendo-wiiu-service-replacements

## The aim of this project is to prepare for the WiiU and 3DS (as they share many API endpoints) EOL (End of Life). Hopefully these will allow for custom servers in the (distant) future. I will be attempting to clone the functionality of every system and game service/server endpoint that I can. Though with limited knowledge and not access to every game this will be a difficult, if not impossible task to do alone.

# **NOTE:** NONE OF THESE SERVERS WILL FUNCTION AS-IS. THIS IS BECAUSE NONE OF THEM CURRENTLY IMPLEMENT SSL, AND NINTENDO SEEMS TO CHECK SSL CERTIFICATES BEFORE ALLOWING CONNECTIONS. WE EITHER MUST PATCH THE SERVICE APPLICATIONS RPX IN NAND (**BRICK RISK**) OR SOMEHOW GET A PROXY SOLUTION WORKING

# Currently cloned endpoints:
- https://account.nintendo.net/v1/api/devices/@current/status
- https://account.nintendo.net/v1/api/content/agreements/TYPE/REGION/VERSION (partly<sup id="a1">[1](#f1)</sup>)
- https://account.nintendo.net/v1/api/content/time_zones/REGION/LANGUAGE (partly<sup id="a2">[2](#f2)</sup>)

<b id="f1">1</b> I do not know what other `TYPE`'s there are. I currently only know of one, `Nintendo-Network-EULA`, I still am unsure as to when I should throw error `1102` and I lack the remaining data for the rest of the EULA agreements. [↩](#a1)

<b id="f2">1</b> I simply lack the rest of the timezone lists. [↩](#a2)

