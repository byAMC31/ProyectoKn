# Usar la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias de la aplicación (usando npm ci para un entorno limpio)
RUN npm ci

# Copiar el resto de la aplicación al contenedor
COPY . .

# Reconstruir bcrypt para la arquitectura del contenedor
RUN npm rebuild bcrypt --update-binary

# Exponer el puerto en el que la aplicación escucha
EXPOSE 5000

# Establecer el comando para iniciar la aplicación
CMD ["npm", "start"]
