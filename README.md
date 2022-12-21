# Ca3 Cinema

This app allows friends to suggest movies and vote for the ones they want to see.

# Setup

1. Clone this repo:
   ```
   git clone git@github.com:daradermody/ca3-cinema.git
   cd ca3-cinema
   ```
1. Make sure NVM is installed:
   ```
   nvm --help
   ```
   If this command returns an error, install using [these instructions](https://github.com/nvm-sh/nvm#installing-and-updating), and restart the terminal afterwards.
1. Setup Node:
   ```
   nvm install
   nvm use
   ```
1. Install dependencies:
   ```
   yarn
   ```
1. Setup Vercel
   ```
   npm install -g vercel
   vercel login daradermody@gmail.com
   vercel pull --yes
   ```
   You may have to wait a little for the `login` command to be authorized. 
1. Start the app in dev mode:
   ```
   yarn start
   ```
   After a second or two, the app becomes available at `http://localhost:3000`

# Code Structure

- `api/`: This folder contains all the backend serverless functions
- `public/`: This folder contains static web files (HTML, favicon, etc.)
- `src/`: This folder contains the bulk of the application frontend
- `build/`: Contains built files
