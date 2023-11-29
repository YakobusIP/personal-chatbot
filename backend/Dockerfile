# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:18-slim

# Install prisma dependencies
RUN apt-get update -y && apt-get install -y openssl

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND yarn.lock are copied.
# Copying this separately prevents re-running yarn install on every code change.
COPY package.json yarn.lock tsconfig.json ./

# Install dependencies.
RUN yarn install --frozen-lockfile

# Copy local code to the container image.
COPY . .

# Transpile TypeScript to JavaScript.
RUN yarn run build

# Set the environment to production
ENV NODE_ENV production
ENV DATABASE_URL postgresql://postgres:@34.42.207.174:5432/personal_chatbot?schema=public

# Expose port
EXPOSE 8080

# Migrate prisma and generate client
RUN npx prisma migrate dev
RUN npx prisma generate

# Run the web service on container startup.
CMD [ "node", "dist/index.js" ]