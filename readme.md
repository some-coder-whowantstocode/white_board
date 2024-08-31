# White Board

<a href="https://white-board-d5cn.onrender.com/" target="_blank" style="text-decoration: none;"><button style="background-color: #87CEEB; color: white; border: none; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Live Site</button></a>


This is a canvas drawing application with collaboration built using the MERN stack (MongoDB, Express.js, React, Node.js), along with canvas, websocket and React Styled Components.

## Features

Table

Feature	Description	
	

| Feature | Description |
|---------|-------------|
| microservice | Each part of the backend is managed separately. |
| Real-Time Collaboration | Multiple users can draw on the canvas simultaneously. |
| WebSocket Integration | Ensures instant updates and synchronization across all connected clients. |
| Stylish UI | The application uses React Styled Components for a modern and responsive user interface |
| User-Friendly Interface | Intuitive and responsive design for easy use. |
| Drawing Tools | Includes various drawing tools like pen, eraser, and color picker. |
| Member list | Users can view the list of members in the room |
| Invitation link | Users can generate an invitation link to invite others to join the room |
| Video call waiting room | Users can go to a waiting room before starting a video call |
| Error notifications | A custom box will notify users about any errors or mistakes while using the app |

## Running Locally

The application consists of two parts: the frontend and the backend. They need to be started separately.

### Running the Frontend

1. Navigate to the client directory: `cd client`
2. Install the dependencies: `npm install`
3. Start the frontend: `npm run dev`

The frontend will be hosted at `http://localhost:5173`.

### Running the GateWay

1. Navigate to the server directory: `cd gateway`
2. Install the dependencies: `npm install`
3. Start the backend: `npm start`

The gateway will be running at `http://localhost:3000`.

### Running the userService

1. Navigate to the server directory: `cd UserService`
2. Install the dependencies: `npm install`
3. Start the backend: `npm start`

The gateway will be running at `http://localhost:9310`.



Enjoy drawing and collaborating!
