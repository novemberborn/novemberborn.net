FROM node:5.5.0-slim

WORKDIR /app
ADD app.tgz /

ENV NODE_ENV=production
CMD ["node", "server.js"]
