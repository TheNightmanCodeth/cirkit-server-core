![Cirkit logo](res/logo.png)
# cirkit_server
Server for cirkit client in nodejs

# Installing - Ubuntu/Debian
>sudo npm install --global cirkit

# Usage
>Register device with server (should auto-pair on first start, otherwise choose menu>set IP)  
Start server:  
>`cirkit server start`  
Stop process in terminal:
>ctrl+c
List devices that can receive pushes:  
>`cirkit devices`  
Push message to device  
>Get device ID from `cirkit devices`  
>`1: Name (ip address)`  
>^ device ID  
>`cirkit push "Message" $(id)`
