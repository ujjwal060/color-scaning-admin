# Step 1: Build Angular app
FROM node:20 AS build
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Angular app for production
RUN npm run build --prod

# Step 2: Nginx to serve Angular app
FROM nginx:stable-alpine

# Copy build output (⚠️ adjust if your dist has a subfolder like dist/my-app-name/)
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/

# Copy custom Nginx server config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose container port (Nginx listens on 80 inside container)
EXPOSE 7879

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
