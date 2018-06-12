###############################################################################
# Build image                                                                 #
###############################################################################
FROM node:8.11.2 as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npx npm@6.1.0 ci

WORKDIR /deps
RUN cp /app/package.json /app/package-lock.json ./ \
  && npx npm@6.1.0 install --only=production --silent

WORKDIR /app
COPY ./ ./

RUN npm test
RUN npm run build
RUN rm -rf content node_modules scripts src

###############################################################################
# Runtime image                                                               #
###############################################################################
FROM node:8.11.2-slim

# Install https://github.com/Yelp/dumb-init so the server can be
# started properly.
RUN curl -sSL "https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64" -o /usr/local/bin/dumb-init \
  && echo "057ecd4ac1d3c3be31f82fc0848bf77b1326a975b4f8423fe31607205a0fe945 */usr/local/bin/dumb-init" | sha256sum -c - \
  && chmod +x /usr/local/bin/dumb-init

# Never run as root
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

WORKDIR /app
ENV NODE_ENV=production
ENTRYPOINT ["/usr/local/bin/dumb-init"]
CMD ["node", "dist/server.js"]

COPY --from=builder /deps ./
COPY --from=builder /app ./
