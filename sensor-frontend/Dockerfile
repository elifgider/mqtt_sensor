# 1. Aşama: Uygulamanın derlenmesi (build edilmesi)
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# 2. Aşama: Nginx ile build edilen dosyaların servis edilmesi
FROM nginx:alpine

# Build edilmiş dosyaları Nginx'in root dizinine kopyala
COPY --from=build /app/build /usr/share/nginx/html

# Nginx varsayılan yapılandırmasını kullanarak başlat
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]