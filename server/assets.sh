#!/usr/bin/env sh

# if denobundle isn't pulled in, download it and make it executable
if ! test -f "./denobundle"; then
	wget "https://github.com/txthinking/denobundle/releases/download/v20220323/denobundle_linux_amd64" -O denobundle
	chmod +x ./denobundle
fi

# bundle up those web assets
./denobundle ../frontend/dist assets.js
