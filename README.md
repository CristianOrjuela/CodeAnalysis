# Backend for the UN-ACARREO project
### Welcome! This is the backend repo for our project. 
We use **postgresql** to manage our database and host our local server
- To install postgres follow the instructions given in link: https://www.postgresqltutorial.com/install-postgresql/
- To create local server follow the instructions given in link: https://www.postgresqltutorial.com/connect-to-postgresql-database/ . Name server UN-ACARREO
- To create database use the pgAdmin UI to create a new database in your server, name it UN-ACARREO.

- To create tables run (this will also start the project)

### `node server`

- To update database schema make sure you are at  Backend/server/Database in your command line and run:

### `sequelize db:migrate`

IF you are having trouble running this command try

### `npm i -g sequelize-cli`
### `npm install -g pg`


- If you want to undo the last migration make sure you are at  Backend/server/Database in your command line and run:

### `sequelize db:migrate:undo`

- If you want to undo all migrations make sure you are at  Backend/server/Database in your command line and run:

### `sequelize db:migrate:undo:all`

- To update database contents make sure you are at  Backend/server/Database in your command line and run:

### `sequelize db:seed:all`

Or if you want to execute a spefic seed file run:

### `sequelize db:seed --seed seed_name.js`

- To delete all insertions made in all seeds make sure you are at  Backend/server/Database in your command line and run

### `sequelize db:seed:undo:all`

- If you are going to drop tables for some reason make sure to undo migrations first.
