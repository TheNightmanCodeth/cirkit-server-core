[![NPM](https://nodei.co/npm/cirkit.png)](https://npmjs.org/package/cirkit)  

# Installing
>sudo npm install -g cirkit

# Usage
Register device with server (should auto-pair on first start, otherwise choose menu>set IP) 

Start server: `cirkit server start`  

List devices that can receive pushes: `cirkit devices`    

Push message to device:  
Get device ID from `cirkit devices`  
`1: Name (ip address)`  
^ device ID  
>`cirkit push "Message" $(id)`  

Get help: `cirkit help`  

Man page: `man cirkit`  
