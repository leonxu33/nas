FROM node:16.15-alpine

RUN mkdir -p /opt/reactfrontend
ADD public /opt/reactfrontend/public
ADD src /opt/reactfrontend/src
ADD package.json /opt/reactfrontend/package.json
ADD package-lock.json /opt/reactfrontend/package-lock.json

RUN cd /opt/reactfrontend && npm install

WORKDIR /opt/reactfrontend
RUN cd /opt/reactfrontend

CMD ["npm", "start"]