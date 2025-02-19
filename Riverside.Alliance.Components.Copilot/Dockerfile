# Use the official Node.js20  image as a base
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install typescript
RUN npm install typescript

# Copy the rest of the application code
# This is done after installing dependencies to improve performance with Docker cache
COPY . .

# Register Slash Commands
CMD ["npm", "run", "register"]

# Run the bot
CMD ["npm", "run", "dev"]
