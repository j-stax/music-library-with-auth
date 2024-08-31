A song database web application built on the MERN stack (MongoDB, Express, React, Node.js). It allows users to manage their own personal library of song titles and other song details. Moreover, users can perform searches by artist and genre for quick filtering. The application also features JWT token-based user authentication and password hashing using bcryptjs. Visit www.jamesahn.net to see a quick demo of this application.

Running the application:

1. Download the project files.
2. Ensure MongoDB is installed, or visit https://www.mongodb.com/ to download (community edition is free).
3. Ensure Node.js is installed, or visit https://nodejs.org/en to download.
4. Open the project folder in your favorite source-code editor.
5. Change the directory to music-lib-server by entering the following command in your terminal: cd music-lib-server
7. Then enter the following commands one after another:
      npm init -y
      npm install express morgan cors mongoose jwt-simple bcryptjs
8. Now enter the following command to start the server:
      npm start
10. Now navigate to the music-lib-client directory by entering the following command: cd ../music-lib-client
11. Enter the following commands:
      npm install react-bootstrap react-router-dom react-router-bootstrap
12. Now enter the following command to start the application:
      npm start
