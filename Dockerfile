# base Node image
FROM node:18-alpine

# sets the working directory inside the container
WORKDIR /app

# copies package.json and package-lock.json (if it exists)
COPY package*.json ./

# installs dependencies
RUN npm install 

# copies the rest of the application code
COPY . .

# runs Prisma to generate the client
RUN npx prisma generate

# runs the build script (usually 'tsc' to compile TypeScript)
RUN npm run build

# exposes the port your app listens on
EXPOSE 3333

# default command to run the application
CMD ["npm", "run", "dev"]