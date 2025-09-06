# Dockerfile for building Ionic APK
FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache \
    openjdk11 \
    bash \
    git

# Set Java environment
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Ionic app
RUN npm run build

# Sync Capacitor
RUN npx cap sync android

# Set working directory to android folder
WORKDIR /app/android

# Make gradlew executable
RUN chmod +x gradlew

# Build the APK
RUN ./gradlew assembleDebug

# Create output directory and copy APK
RUN mkdir -p /output && \
    cp app/build/outputs/apk/debug/app-debug.apk /output/

# Set the final working directory back to app
WORKDIR /app

# Command to run when container starts (optional)
CMD ["echo", "APK built successfully! Check /output/app-debug.apk"]