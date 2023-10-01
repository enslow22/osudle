ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /usr/src/app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build


FROM nginx
# Copy built assets from `builder` image
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
