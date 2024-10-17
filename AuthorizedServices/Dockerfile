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

# Set ARG values to pass build-time variables
ARG MONGO
ARG JWT_SECRET
ARG ORS_API_KEY
ARG WEATHER_API_KEY
ARG RAZORPAY_KEY_SECRET
ARG RAZORPAY_KEY_ID

# Use ENV to set environment variables inside the container from ARGs
ENV MONGO=$MONGO
ENV JWT_SECRET=$JWT_SECRET
ENV ORS_API_KEY=$ORS_API_KEY
ENV WEATHER_API_KEY=$WEATHER_API_KEY
ENV RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET
ENV RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID

# Expose the necessary port
EXPOSE 8800

# Start the application
CMD ["npm", "start"]
