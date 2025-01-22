FROM python:3.13

EXPOSE 8000

WORKDIR /root/

COPY . .

RUN chmod +x start_back.sh

ENTRYPOINT ["sh", "./start_back.sh"]