////////////////////////////////////////////////////////
Parfait API
///////////////////////////////////////////////////////////

All files can be found at https://github.com/FionaWrigley/ParfaitBackEnd

import parfait.sql into mySQL database

Update .env file to include the following database paramaters pointing to your new DB

DB_HOST
DB_DATABASE
DB_USER
DB_PORT
API_PORT
DB_PASSWORD

Update .env file to include your IP address in environment variable 

ADMIN_IP1


ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001
CLOUDINARY_URL=cloudinary://465827455395558:peENhYFgYlCg9LqJSbPFNHOBwoA@parfait

Update .env file to include a value for 

SESSION_SECRET

/////////////////////////////////////////////////////////////

Navigate into api folder.

Use command 'npm install' to pull in dependencies

Set up is now complete.
///////////////////////////////////////////////////

Use the following commands to run the server

Use command 'node server.js' to run the api

Use command 'npm test' to run jest test scripts