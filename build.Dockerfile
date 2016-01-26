FROM node:5.5.0

WORKDIR /app
COPY package.json npm-shrinkwrap.json ./
RUN npm install --silent

COPY .babelrc postcss.json .stylelintrc ./
COPY src ./src
COPY content ./content
COPY static ./static

RUN npm test
RUN npm run build
RUN npm prune --production
RUN rm -rf .babelrc postcss.json .stylelintrc npm-shrinkwrap.json src
