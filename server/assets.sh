#!/usr/bin/env sh

if ! test -f "./denobundle"; then
	wget "https://github.com/txthinking/denobundle/releases/download/v20220323/denobundle_linux_amd64" -O denobundle
	chmod +x ./denobundle
fi

./denobundle ../frontend/dist assets.js

