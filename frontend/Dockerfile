# Usa la imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Copia el resto del código fuente
COPY . .

# Expone el puerto (Vite usa el 5173)
EXPOSE 5173

# Comando para iniciar el servidor
CMD ["npm", "run", "dev", "--", "--host"]

