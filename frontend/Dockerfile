FROM node:22

WORKDIR /root/

COPY . .

EXPOSE 3000

RUN npm install

ENTRYPOINT ["sh", "-c", "npm run dev"]
