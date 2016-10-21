FROM kong:0.9.3

# Auto configuration requires NodeJS
RUN \
  curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - && \
  yum -y install nodejs

# Add auto configuration scripts
COPY ./start.sh /start.sh
COPY ./start-auto-configure.sh /start-auto-configure.sh
COPY ./setup-scripts /tmp/setup-scripts

RUN \
  chmod +x /start.sh && \
  chmod +x /start-auto-configure.sh && \
  cd /tmp/setup-scripts && \
  npm install --production --progress=false

CMD ["/start.sh"]
