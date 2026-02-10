
FROM ghcr.io/puppeteer/puppeteer:21.3.8
WORKDIR /app
COPY --chown=root:root . .

USER root
RUN chmod 755 /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm install

VOLUME ["/app/shared","/app/exported"]

RUN ls

ENTRYPOINT ["node", "render.js"]
