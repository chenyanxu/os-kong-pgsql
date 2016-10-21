FROM kong:0.9.3

COPY ./start.sh /start.sh
COPY ./start-auto-configure.sh /start-auto-configure.sh
COPY ./setup-scripts /tmp/setup-scripts

RUN \
  chmod +x /start.sh && \
  chmod +x /start-auto-configure.sh && \
  cd /tmp/setup-scripts && \
  npm install --production --progress=false && \
  node index.js && \
  /tmp/kong-plugins-setup.sh

CMD ["/start.sh"]
