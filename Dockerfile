FROM kong:0.9.3

COPY ./start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/start.sh"]