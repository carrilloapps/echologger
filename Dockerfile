# Usa la imagen oficial de Node.js como base
FROM node:18

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que el servidor estará escuchando
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["node", "server.js"]
