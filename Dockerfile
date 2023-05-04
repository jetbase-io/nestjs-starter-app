FROM node:16-alpine
WORKDIR /home
COPY . /home
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
# prod
CMD npm run publish-migration & npm run start:prod

# dev
# CMD npm run seed & npm run start:dev