# ARCANA FRONTEND

## TODO

## Frontend

- [x] fix the issues with the UI
- [x] remove all icons and non essential things in the dashboard.
- [x] just have a table of all the information for that user, a way to talk to clerk auth, protected routes
- [x] setup auth with supabase
- [ ] create a supabase query to get all capture and to insert new captures
- [ ] expose an api to the extension to send messages to the user
- [ ] use cookies form api requests to authenticate the user and send messages to supabase
- [ ] expose another api to receive questions form supabase, send them to openai and send the response to the extension
- [ ]

## Exntension

- [x] User turborepo to create the sidebar component of the extension
- [ ] Run a background service worker to senda and receive api calls
- [ ] Create a ui element that is a button on bottom left
- [ ] Use a context menu to save text from a website and send to the background service worker
- [ ] Change button ui when hovered
- [ ] Have a option in button ui to request for a question from the background service worker
