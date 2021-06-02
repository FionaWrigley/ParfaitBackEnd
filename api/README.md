
# Parfait

Parfait is a social, schedule sharing app which allows friends and family to view each other’s schedules to find available free space that suits the whole crew. 
## Authors

[@FionaWrigley](https://github.com/FionaWrigley)

  
## Roadmap

#### Short Term 0-3 months

-	Registration password validation fix 
-	Edit repeat events
-	Delete repeat events
-	Swipe to leave group feature
-	Change view option on group schedule 
        - Week
        - Fortnight
        - Month
        - 3 Months

#### Medium Term 6-12 months

-	Notifications – a user should be notified of invitation to     group and can choose to reject or accept
-	Accepted groups only - A member’s schedule should not be visible by group members until said member accepts the invitation to the group. Members should be able to see the group name and invited members prior to accepting the invitation
-	Blocking – a member should be able to block other members
-	Oauth – login via socials
-	Import calendars – import external calendars to availability
-	Group events

#### Long Term 12 months+

-	Reminders / alarms on events
-	Map integration and address look up on event location
-	Family sharing enabling viewing and booking of events in family member calendars
-	Ability to invite non-Parfait members to register via email and / or text
-	Message capacity – group / or individual level
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


| Parameter || Description                |
| :-------- | :------- | :------------------------- |
| DB_HOST | **Required**. URL of your database |  
| DB_DATABASE | **Required**. Database name |
| DB_PORT | **Required**. Database port |
| DB_USER | **Required**. Database user | 
| DB_PASSWORD | **Optional**. Database password. May be left blank when connecting without password |
| SESSION_SECRET | **Required**. Secret for generating secure sessions |   
| DB_ORIGIN | **Required**. URL of Parfait app |
| DB_ADMIN_ORIGIN | **Required**. URL of Parfait Admin app |
| DB_CLOUDINARY_URL | **Required**. URL of cloudinary domain where images will be stored |
| DB_ADMIN_IP1 | **Optional**. IP address for admin user |
| DB_ADMIN_IP2 | **Optional**. IP address for admin user |



## Demo

#### Parfait Demo

https://parfait-coral.vercel.app/

#### Parfait Admin Demo

https://parfait-admin.vercel.app/

  
## Tech Stack

**Client:** 
- NextJS 10.2.0
- React 17.0.2
- TailwindCSS 2.1.2

**Server:** 
- Node v12.19.0
- Express 4.17.1
- Apache 2.4.41
- MySQL 8.0.18


## Additional technologies
  
  #### Image handling
  - cloudinary - cloud image upload
  - multer - image handling

  #### Sessions
  - express-session
  - cookie-parser
  - cors - CORS handling
  - express-mysql-session - used for DB session store
  - express-rate-limit
  
  #### Database
  - mySQL express - SQL handling
  
  #### Logging
  - winston

  #### Validation
  - Express validator
  - validator

  #### Other
    - Cryto-js - for hashing passwords
    - date-fns - allows date functions
    - dotenv - handling environment variables

## Features

- Progressive Web App
- Light/dark mode toggle
- Fullscreen mode


  
## Run Locally


Clone the project

```bash
  git clone https://github.com/FionaWrigley/ParfaitBackEnd/
```

Create a mySQL database and import schema parfaitDB.sql


Go to the project directory

```bash
  cd ParfaitBackEnd/api
```

Install dependencies

```bash
  npm install
```

- create a .env file (see environment variables)


Start the server

```bash
  node server.js
```


  
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

  