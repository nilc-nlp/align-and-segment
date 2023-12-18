# Step 1: Build the React application
FROM node:16 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ./

# Expose port 3000
EXPOSE 3000

# Start the spp
CMD ["npm", "start"]
