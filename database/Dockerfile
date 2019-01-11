FROM mysql:5.7.22

ENV MYSQL_DATABASE freechat

COPY ./CreateTable.sql /docker-entrypoint-initdb.d/
