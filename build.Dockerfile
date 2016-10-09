FROM node:6.7.0

WORKDIR /app
COPY npm-shrinkwrap.json ./
RUN npm install --silent

# Copy the full set of dependencies, then remove the dev ones. Doing this before
# the rest of the source code is added allows the dependencies to remain in a
# cached layer in the final image.
WORKDIR /prod_modules
RUN cp -R /app/* ./
COPY package.json ./
RUN npm prune --silent --prod

WORKDIR /app
COPY ./ ./

RUN npm test
RUN npm run build
RUN rm -rf postcss.json npm-shrinkwrap.json content scripts src
