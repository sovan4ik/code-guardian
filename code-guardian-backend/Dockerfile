FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache git curl

RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
    | sh -s -- -b /usr/local/bin

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001 3000
CMD ["node", "dist/main.js"]
