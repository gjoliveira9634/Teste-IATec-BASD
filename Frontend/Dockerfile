FROM node:alpine

WORKDIR /usr/src/app

# copia apenas package.json e package-lock.json
COPY package.json package-lock.json* ./
RUN npm install -g @angular/cli
RUN npm install

# copia todo o restante do projeto
COPY . ./

EXPOSE 80

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "80"]
