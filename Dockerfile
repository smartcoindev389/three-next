# Use the base image
FROM node:20-bullseye

# Install dependencies, including AWS CLI
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    awscli \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set build arguments for AWS CLI
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

# Configure AWS CLI with the provided credentials and region
RUN aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID \
    && aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY \
    && aws configure set default.region $AWS_DEFAULT_REGION

# Copy .env file from S3 using AWS CLI
RUN aws s3 cp s3://platformz-devops-private/PROD/PLATFORMZ-FRONTEND/.env ./.env

# Copy package.json and package-lock.json
COPY package*.json ./
# COPY gsap-bonus.tgz ./

# Install all dependencies
RUN npm install -g husky
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Define the command to run the Next.js application
CMD ["npm", "run", "start"]