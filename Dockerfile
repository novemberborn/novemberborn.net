###############################################################################
# Build image                                                                 #
###############################################################################
FROM node:8.5.0 as builder

RUN apt-get update \
  && apt-get install -y jq=1.4-2.1+deb8u1 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/create-package.jq ./scripts/
COPY package-lock.json ./
RUN jq -f scripts/create-package.jq package-lock.json > package.json \
  && npm install --silent

WORKDIR /deps
RUN cp /app/package.json /app/package-lock.json ./ \
  && npm install --silent --prefer-offline --production

WORKDIR /app
COPY ./ ./

RUN npm test
RUN npm run build
RUN rm -rf content node_modules scripts src

###############################################################################
# Runtime image                                                               #
###############################################################################
FROM node:8.5.0-slim

# Install https://github.com/Yelp/dumb-init so the server can be
# started properly.
RUN curl -sSL "https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64" -o /usr/local/bin/dumb-init \
  && echo "81231da1cd074fdc81af62789fead8641ef3f24b6b07366a1c34e5b059faf363 */usr/local/bin/dumb-init" | sha256sum -c - \
  && chmod +x /usr/local/bin/dumb-init

# Never run as root
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

WORKDIR /app
ENV NODE_ENV=production
CMD ["dumb-init", "node", "dist/server.js"]

COPY --from=builder /deps ./
COPY --from=builder /app ./
