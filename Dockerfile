FROM kong:0.9.3

COPY ./start.sh /start.sh

CMD ["/start.sh"]