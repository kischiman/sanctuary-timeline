# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for root
COPY package*.json ./
RUN npm install

# Install and build client
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install
COPY client/ .
RUN npm run build

# Install server dependencies
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy server source
COPY server/ .

# Copy root files
WORKDIR /app
COPY package*.json ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/index.js"]