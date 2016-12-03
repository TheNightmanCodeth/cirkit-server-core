#!/bin/bash
get_deps() {
	#Git
	if hash git 2>/dev/null; then
		echo ':::Git is installed, continuing...'
	else
		echo ':::Git is not installed, installing...'
		sudo apt install -y git
		echo ':::Installed git, continuing...' 
	fi
	#Node
	if hash node 2>/dev/null; then
		echo ':::Node is installed, continuing...'
	else
		echo ':::Node is not installed, installing...'
		curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
		sudo apt install -y nodejs
		echo ':::Done installing node & npm...'
	fi
	#NPM
	if hash npm 2>/dev/null; then
		echo ':::Npm is installed, continuing...'
	else
		echo ':::Npm is missing, something is horribly wrong. Reinstall node, or uninstall node and rerun this script and I will do it for you'
		exit
	fi
}

get_repo() {
	#Make temp directory
	sudo mkdir cirkit-tmp/
	#Clone the repo
	cd cirkit-tmp/ && git clone https://github.com/TheNightmanCodeth/cirkit-server-core.git
	#Enter the repo
	cd cirkit-server-core/
}

install() {
	echo ':::Running npm install...'
	npm install
	echo ':::Moving files around...'
	sudo mkdir ~/Documents/cirkit-core && sudo cp cirkit-core/* ~/Documents/cirkit-core/ && sudo cp -R node_modules/ ~/Documents/cirkit-core/
	echo ':::Adding PATH variables...'
	#Add ~/cirkit-core to path 
	echo 'PATH=~/Documents/cirkit-core:$PATH' > ~/.profile
	#'Refresh' the PATH
	source ~/.profile
	#Remove the temp directory
	cd .. && sudo rm -rf cirkit-tmp/
}

#Install dependencies
get_deps
#Get repo
get_repo
#Move scripts around
install
#All finished!
echo ':::Cirkit is installed!'
exit 1
