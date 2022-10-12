FROM node
WORKDIR /opt/node-app
COPY . .
RUN npm install --production
CMD ["node","server.js"]