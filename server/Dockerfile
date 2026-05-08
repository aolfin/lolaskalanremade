# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Clear any existing node_modules
RUN rm -rf node_modules package-lock.json

# Copy package.json
COPY package.json ./

# Install application dependencies fresh
RUN npm install --no-cache

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Seed database and start server
CMD ["sh", "-c", "npm run seed && npm start"]
