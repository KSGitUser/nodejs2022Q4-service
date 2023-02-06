# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/KSGitUser/nodejs2022Q4-service.git
```

## Installing NPM modules

```
npm install
```

## Environments

By default the server is using on port 4000. If you would like to use a custom post you can run the command

```javascript
cp .env.example .env
```
It will create `.env` file from `.env.example` file. Inside it you can change PORT variable.
Or you can create it manually

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites. If you will see an error, please, check that 
the server war run in section `Running application` .

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging


### Swagger - API
On address http://localhost:4000/swagger/, after start server, you can try and see swagger for API


