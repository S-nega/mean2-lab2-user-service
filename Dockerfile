
# Определение второго сервиса для Express.js API
FROM node:latest

# Устанавливаем рабочую директорию внутри контейнера для API
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json для установки зависимостей API
COPY package*.json ./

# Устанавливаем зависимости API
RUN npm install --legacy-peer-deps

# Копируем все файлы проекта API в рабочую директорию контейнера
COPY . .

# Определяем порт, который будет прослушивать контейнер Express.js
EXPOSE 3000

# Команда для запуска Express.js приложения
CMD ["node", "server.js"]

# Используем официальный образ Node.js в качестве базового образа для сборки Angular приложения

FROM node:latest AS build

WORKDIR /usr/local/app

COPY package*.json ./

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/local/app/dist/lab2-users /usr/share/nginx/html

EXPOSE 80