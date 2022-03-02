# project-creation
Lambda function to automate project creation in infra

# Usage
Call the lambda function synchronously

# Installation
* `npm ci`

# Build
* `npm run build`
* build is inside `./build`
* zip artefact is inside `./artefact`

# Tests
Integration tests are run with Mocha.
Botfront and MongoDB docker containers will be run.
Make sure to avoid port collisions with other servers.

* install `docker`
* have the latest version of `botfront-private` docker image locally available
* run `npm run test`
