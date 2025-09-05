# Step 1: Build Angular app
FROM node:20 AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --prod

# Step 2: Nginx to serve Angular app
FROM nginx:stable-alpine

# Copy build output
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/

# Copy your existing nginx.conf into conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7879
CMD ["nginx", "-g", "daemon off;"]
