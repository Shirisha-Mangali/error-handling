# Base image
FROM node:20

# Set working directory
WORKDIR /app


# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "server.js"]
