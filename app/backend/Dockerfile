FROM node:24

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]

# BUILD:
# docker build -t chefbot-backend .   

# RUN:
# docker run --name cb-backend -d --env-file ./.env --network cb-net -p 8000:8000 chefbot-backend

