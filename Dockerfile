# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Expose the app's port (if needed)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]