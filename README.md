# Cron Push

## Quickstart

1. `docker-compose up -d`\
    Start the mysql database
    See `docker-compose` section

2. `npm i`\
    Install node dependencies

3. `npm start`\
    Build the project and watch for changes. After each build, the lint and
    serve scripts will be run.

## Environment
1. Node environment variables: `src/environment.ts`
    * You may create a `.env` file in the project root directory to modify defaults
    * Shell environment variables **will** be passed on to node and will overwrite
        variables listed in the `.env` file
2. MySQL environment variables: `mysql/Dockerfile`
    * Shell environment variables **will not** be passed on to MySQL

## docker-compose
* docker-compose up -d\
  Start the mysql container in the background

* docker-compose stop\
  Stop the mysql container

* docker-compose down\
  Destroy the mysql container. Any changes made to the database will be lost

* docker-compose up --build -d\
  If any changes are made to the `docker-compose.yml` file or the `mysql` folder, add
  the `--build` flag to the command when starting to incorporate the changes

## Build
```
npm run build
```

## Serve
```
npm run serve
```

## Tests

Tests use the database specified by the environment variable MYSQL_TEST_DB, `cron-push-test`
by default. The database will be cleared completely for each test

### Standalone
```
npm test
```

### During development
`npm start` will start the tests in debug mode.\
Attach a debugger to the default node debug port, `9229`, and continue past the initial breakpoint to run the tests.\
The test will be restarted when the code changes or by typing `rs` into the terminal to restart manually.