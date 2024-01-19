Hello! This is my submission for the Everyrealm Take Home Assessment!

In order to run and test this file properly, please follow the steps below

*************DATABASE SET-UP*************

- When forked, please make sure that you have a Postgres SQL Shell installed
- Please follow the steps below to initialize your database
      - Open your Postgres SQL Shell
      - Enter your log in credentials (usually just press enter except for your password)
      - Create a database called everyrealm with 'CREATE DATABASE everyrealm;'
      - Connect to your new database with \c everyrealm
      - use the following commands to initialize your tables (copy and paste)

          CREATE TABLE burrito (
              burrito_id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              size CHAR(2) CHECK (size IN ('S', 'M', 'L', 'XL')) NOT NULL,
              price DECIMAL(5, 2) NOT NULL
          );

          CREATE TABLE order_table (
              order_id SERIAL PRIMARY KEY,
              total_cost DECIMAL(8, 2) NOT NULL
          );
          CREATE TABLE order_item (
              order_item_id SERIAL PRIMARY KEY,
              order_id INT,
              burrito_id INT,
              quantity INT NOT NULL,
              FOREIGN KEY (order_id) REFERENCES order_table(order_id),
              FOREIGN KEY (burrito_id) REFERENCES burrito(burrito_id)
          );

- Change your credentials in db.js to your own, (password should be the only real change)
- Lastly we can seed the mock data I have set up using 'npm run seed' (make sure you are cd'ed into the server directory) 
- Thats the hard stuff set up!

*************DOCKER APPLICATION SET-UP*************
- Make sure you have Docker installed correctly to simulate a proper enviornment for the app
- To run the application and test it is simple, please follow the steps below!
- Properly set up the docker image by typing 'docker run -it -d jasxnlin/everyrealm:1.0' in your Command Line (Bash)
- Then run 'docker run -p 1337:1337 1c9d089617d2d7bf701387f404c8a3a0bd0f5a4eadff06cee8b4774235382309' in your Command Line (Bash)

*************APPLICATION SET-UP*************
- If you dont want to use Docker, and are confident that your enviornment is set up correctly, simple run the code in your terminal using 'npm start'

*************TEST SET-UP*************
- To test the application, please be sure to run 'npm run seed' BEFORE and AFTER every modification to the database and test runs
- Run 'npm test' to test the Jest suites I have set up
- Whether on the Docker Container, or from your machines enviornment, the best way to test the routes is to use Insomnia or Postman. Feel free to play around with the routes!

- Thats it! I hope my submission is up to par!
