FROM node:18
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build React app
RUN npm run build

# Install `serve` globally
RUN npm install -g serve

# Serve build on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
