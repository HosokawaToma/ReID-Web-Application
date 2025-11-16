FROM node:20.9.0-alpine

ARG HTTP_PROXY
ARG HTTPS_PROXY

ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY
ENV https_proxy=$HTTPS_PROXY

WORKDIR /app

RUN if [ -n "$HTTP_PROXY" ]; then npm config set proxy $HTTP_PROXY; fi

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
