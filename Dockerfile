FROM node
WORKDIR /opt/node-app
COPY . .
WORKDIR /opt/node-app/control_app
RUN npm install --production
RUN node index.js
WORKDIR /opt/node-app
RUN npm install --production
CMD ["node","server.js"]