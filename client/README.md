# Vention Take Home Exercise - Client
This HTML/CSS/JS frontend uses ReactJS and canvas to render moving pendulums.  
It communicates with the backend to fetch the pendulum states.  

## Development setup
 
In the project directory, run:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Make sure you started the server under `/server` if you want to run the simulation.

## Features

Move a pivot point along the anchor line by dragging it.  

Move a pendulum horizontally by dragging its rod.  

Move a bob anywhere by dragging it.  

Change the wind direction by dragging the compass arrow.  

Start, pause and stop the simulation by using the buttons.  

## Issues

Improve the management of the simulation state. Since there is no central server, the simulation state must be inferred from the state of all pendulums.  
The current method is easy, but fragile. Networks lags can easily cause the frontend state to be wrong.
