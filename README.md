# NOTE: 
### If there is any confusion in .env file configuration or Api documenatation, please contact me.
```bash
bethasiva7780@gmail.com
```

## Copy .env.example file to .env and replace those values with yours
#### Linux/macOs
```bash
$ cp .env.example .env
```
#### Windows 
```bash
copy .env.example .env
```

## Mail service configuration

### By default emails will be stored as plain text files inside the `emailFiles` directory as `USE_NULL_EMAIL_SERVICE` value is `true` .
### If you want to use some mail service, setup the env values and must set `USE_NULL_EMAIL_SERVICE` value as `false` in .env file.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## For APIS' Documenatation 
```bash
http://localhost:8000/api-documenatation
```