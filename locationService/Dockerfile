# Stage 1: Build Stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build script (if your project has a build step, e.g., for TypeScript)
# Uncomment the line below if needed
# RUN npm run build

# Stage 2: Production Stage
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app .

# Install only production dependencies
RUN npm install --production


# Expose the necessary port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
