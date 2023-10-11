
FROM ghcr.io/puppeteer/puppeteer:21.3.8
WORKDIR /app
COPY --chown=root:root . .

USER root
RUN chmod 755 /app
RUN npm install
RUN cd node_modules/puppeteer && node install.mjs

VOLUME ['/app/shared','/app/exported']

RUN ls

CMD ["node", "render.js"]
