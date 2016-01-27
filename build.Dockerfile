FROM node:5.5.0

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
COPY .babelrc postcss.json .stylelintrc ./
COPY src ./src
COPY content ./content
COPY static ./static

RUN npm test
RUN npm run build
RUN rm -rf .babelrc postcss.json .stylelintrc npm-shrinkwrap.json src
