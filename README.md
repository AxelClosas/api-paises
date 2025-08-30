# API PAÍSES

## Objetivos
* Comprender como funciona el patrón MVC dividido en capas
* Aplicar los conocimientos adquiridos a lo largo de la cursada

## Tecnologías utilizadas
* Javascript
* NodeJS
* Express
* Express-Validator
* dotenv
* Sanitize-html
* Mongoose
* MongoDB
* EJS
* Express-ejs-layouts
* HTML
* CSS

## Requisitos
1. git (Para clonar el repositorio)
2. Node.js

## Pasos para instalación
1. Clonar el repositorio e ingresar a la carpeta
```bash
git clone git@github.com:AxelClosas/api-paises.git
cd api-paises
```
2. Crear una variable de entorno .env en la raíz del proyecto y pegar el siguiente contenido
```
ENDPOINT_PAISES="https://restcountries.com/v3.1/region/america"
PORT=3000
DB_URL="mongodb+srv://Grupo-04:grupo04@cursadanodejs.ls9ii.mongodb.net/Node-js"
```
3. Instalar las dependencias con el siguiente comando
```bash
npm install
```
4. Ejecutar el proyecto con el siguiente comando
```bash
npm run dev
```
5. Ingresar a la url http://localhost:3000

