# tokenomics
Repo for the http://tokenomics.io website

# getting started locally

Here's a little guide to build the project locally.

## Back End


1. With the following commands, install MySQL, create tokenomics databases, create tokenomics sql user.
```sh
brew install mysql # install mysql on mac
mysqladmin -u root password 'yourpassword' # set your root password
mysqld # runs mysql service
mysql -uroot -p
CREATE DATABASE tokenomics_local;
CREATE DATABASE tokenomics_local_testing;
CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'new_password';
GRANT ALL ON tokenomics_local.* TO 'new_user'@'localhost';
GRANT ALL ON tokenomics_local_testing.* TO 'new_user'@'localhost';
FLUSH PRIVILEGES;
```

2. install v1 api dependencies from `package.json`
```sh
cd ./api/v1/
npm install
```

3. Create `.env` file in `./api/v1` containing user sql password and 2 other bits of info: Edit via ```nano .env``` and set file to:
```sh
NODE_ENV=development
MYSQL_USER='new_user' # from above
MYSQL_PW='new_password' # from above
PORT='4000'
```

4. Migrate the database schema (`./api/v1/server/db/migrations`) and seed the database (`./api/v1/server/db/seeds`)
```sh
knex migrate:latest
knex seed:run
npm start
```

Now the API is running on port 4000.

NB: Right now, the database is seeded via a JS script that parses the TSV from `./monitors/etherTip_data_edited.txt`.

## Front End

In a new terminal window:

1. Install the front end dependencies from `package.json` and start the http server.
```sh
cd ./front-end/
npm install
npm start
```

Great, the front end is running on http://localhost:3000 reading from an API on port 4000.
