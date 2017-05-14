Repo for Cirkit central server. Python WIP!  

# Installing
`COMING SOON(:`
`sudo snap install cirkit-server`

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
