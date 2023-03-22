# hudstart
> a stream overlay for game tournaments using start.gg

hudstart will pull all the relevant data from the start.gg api and fill out the overlay, so you don't have to

## using
all you need to do to get started is download a binary from the releases page (or compile one with `deno task build`), and it will open both the overlay and the admin interface when you run the server (urls default to http://localhost:6875 and http://localhost:6875/admin.html).

you will need to generate an API key when you first use it, which it will tell you how to create. then all you need to do is paste in a link to the tournament you want to stream!

## adding the overlay to OBS
under sources, you will need to create a new browser source. under URL, put `http://localhost:6875`, set width and height to `1920` and `1080`, and make sure `refresh browser when scene becomes active` is checked.
