# Redox Sample Application

## Getting Started

### Install [Sails](http://sailsjs.org)
~~~bash
$ sudo npm -g install sails
~~~

### Install [PostgreSQL](http://www.postgresql.org/)
  * Mac: [Here is a guide](http://www.gotealeaf.com/blog/how-to-install-postgresql-on-a-mac) using homebrew. This is preferred because it does all of the role setup for you.
  
### Install Dependencies
~~~bash
$ npm install
$ bower install
~~~

### Setup a local database
~~~bash
$ createdb end-point
~~~

### Complete organization specific setup
In `/api/controllers/RedoxController.js` specify your source and/or destination values within the "TODO" section. Alternatively you can set the following environment variables for your node app: 
- `VERIFICATION_TOKEN`
- `REDOX_API_KEY`
- `REDOX_API_SECRET`

### Run Locally
~~~bash
$ sails lift
~~~
