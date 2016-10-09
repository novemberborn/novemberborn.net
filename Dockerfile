FROM node:6.7.0-slim

WORKDIR /app
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]

ADD node_modules.tgz ./node_modules/
ADD app.tgz ./
