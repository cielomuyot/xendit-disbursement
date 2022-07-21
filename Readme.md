# Xendit Coding Exercise

This is an updated version of the `Readme.md`. If you wish to see the original version, please see the [Readme-original.md](https://github.com/cielomuyot/xendit-disbursement/blob/master/Readme-original.md) file.

## Setup

1. This repository requires `node v16 and up` to run `Artillery`

2. Run `npm install` to install the dependencies.

3. Run `npm test` to run the automated tests.

4. Run `npm start` to run the app, or `npm run start:dev` to run using `nodemon`.

5. Run `npm run test:load` to run the load testing using `Artillery` and `forever`. This will automatically spawn and stop a daemon.

## Documentation

1. Documentation is written using Swagger.

2. You can access it locally using `http://localhost:8010/docs`, or in [Heroku](https://cm-xendit-tech-exam.herokuapp.com/docs/).

3. If you wish to update the docs, go to the `./docs` folder and do the necessary changes.

## CI/CD

This project uses `CircleCI` and deploys to [Heroku](https://cm-xendit-tech-exam.herokuapp.com/). If you wish to deploy your changes, simply create a Pull Request to `master`, the pipeline will automatically run and deploy once it gets merged. The tests will also be run every time your changes are pushed.
![image](https://user-images.githubusercontent.com/23202976/180145153-82152643-ad08-44ce-b234-a6df968ee4f6.png)

## Testing

### Automated tests

This project implements automated tests. Once the tests are run using `npm test`.

**CLI report:**

![image](https://user-images.githubusercontent.com/23202976/180145977-201d6bd9-91fd-4c8e-8025-4a801ec85d26.png)

**HTML report:**

![image](https://user-images.githubusercontent.com/23202976/180145703-3079c57c-11fa-4855-b14c-ff5d7d7417b3.png)

### Load test

Load test can be done by running `npm run test:load`.

**CLI report:**

![image](https://user-images.githubusercontent.com/23202976/180147628-d72806c7-7e90-4eb4-b47f-e8f7f23970ae.png)

**HTML report:**

![image](https://user-images.githubusercontent.com/23202976/180147746-819044a4-7145-44cb-bd93-223606551d25.png)
![image](https://user-images.githubusercontent.com/23202976/180147700-b76e9c72-1a68-4609-a0ff-c05f13db8d52.png)
