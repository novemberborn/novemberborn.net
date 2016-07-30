FROM node:6.3.1-slim

WORKDIR /app
ENV NODE_ENV=production
CMD ["node", "server.js"]

ADD node_modules.tgz ./node_modules/
ADD app.tgz ./
