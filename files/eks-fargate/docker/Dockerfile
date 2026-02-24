# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .
RUN chmod +x node_modules/.bin/vite
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY files/eks-fargate/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
