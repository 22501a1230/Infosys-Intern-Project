FROM node:18-alpine as backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]
