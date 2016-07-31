FROM node:6.3.1

WORKDIR /app
COPY package.json npm-shrinkwrap.json ./
RUN npm install --silent

# Copy the full set of dependencies, then remove the dev ones. Doing this before
# the rest of the source code is added allows the dependencies to remain in a
# cached layer in the final image.
WORKDIR /prod_modules
RUN cp -R /app/* ./
RUN npm prune --silent --prod

WORKDIR /app
COPY ./ ./

RUN npm test
RUN npm run build
RUN rm -rf postcss.json npm-shrinkwrap.json scripts src
