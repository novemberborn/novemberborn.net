FROM node:5.6.0-slim

WORKDIR /app
ENV NODE_ENV=production
CMD ["node", "server.js"]

ADD node_modules.tgz ./node_modules/
ADD app.tgz ./
