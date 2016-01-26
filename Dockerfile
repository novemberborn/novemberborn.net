FROM node:5.5.0-slim

WORKDIR /app
ADD app.tgz /

CMD ["node", "server.js"]
