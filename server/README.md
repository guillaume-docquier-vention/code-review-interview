# Vention Take Home Exercise - Server
This Typescript backend uses NodeJS and Express to serve an APIs that expose pendulums states.  
It simulates nodes being run on different machines with P2P synchronization.  
This is why they communicate via HTTP rather than sharing state or using IPC.  

## Development setup

In the project directory, run:

### `npm ci`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
5 instances of pendulums will be available at:
- [http://localhost:3001](http://localhost:3001)
- [http://localhost:3002](http://localhost:3002)
- [http://localhost:3003](http://localhost:3003)
- [http://localhost:3004](http://localhost:3004)
- [http://localhost:3005](http://localhost:3005)

## Exposed endpoints

### `GET /pendulum`
Gets the pendulum state.

### `POST /start`
Starts the simulation with the provided pendulum data.

### `POST /pause`
Pauses the simulation.

### `POST /reset`
Stops the simulation. The starting state is returned.

### `POST /collision`
Used to report a collision. This will propagate to all pendulums in the cluster.  
A restart will happen once all pendulums have acknowledged the collision.  

### `POST /restart`
Restart the simulation.  
Only works if all pendulums have acknowledged the restart.  
