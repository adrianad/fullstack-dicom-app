# Use an official Node.js image that supports ES modules
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code (including server.mjs)
COPY . .

# Expose the port on which your Node server listens (adjust if needed)
EXPOSE 4000

# Start your Node backend
# If your server is started with "node server.mjs" for production:
# CMD ["node", "server.mjs"]

# If you prefer to run a development server (e.g., using Vite's dev server),
# you might use:
# CMD ["npm", "run", "dev"]
