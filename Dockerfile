FROM node:lts-alpine@sha256:76badf0d0284ad838536d49d8a804988b4985fc6bc7242dfff4f8216c851438b as development

RUN apk add dumb-init

USER node

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD ["dumb-init", "node", "index.js"]

FROM node:lts-alpine@sha256:76badf0d0284ad838536d49d8a804988b4985fc6bc7242dfff4f8216c851438b as production

RUN apk add dumb-init

USER node

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production

COPY --chown=node:node . .

CMD ["dumb-init", "node", "index.js"]