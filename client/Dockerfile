# Use a specific Node.js version for reproducibility
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and the npm lockfile to leverage Docker cache.
# This step is only re-run if these files change.
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Expose the port the Vite dev server runs on
EXPOSE 3000

# Command to run the app in development mode using npm.
# The '--' is used to pass the '--host' and '--port' flags to the 'vite' command.
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]