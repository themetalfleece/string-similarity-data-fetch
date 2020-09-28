A web server which returns data associated with a key based on its similarity with a given string, by querying a MongoDB database

## Associated projects:

[Twitch interface](https://github.com/themetalfleece/twitch-string-similarity-data-fetch)

[Data populator](https://github.com/themetalfleece/string-similarity-populator)

## Install

1. Install [node.js](https://nodejs.org/en/download/), [yarn](https://classic.yarnpkg.com/en/docs/install/), [mongodb](https://www.mongodb.com/try/download/community).
2. Configure `mongodb` so its server is running.
3. Clone this repository, and using a terminal navigate to its directory.
4. Run `yarn` to install the dependencies.

## Build & Run

1. Copy the contents of the `.env.example` file to a `.env` next to it, and edit it with your values.
    - Set `MONGODB_CONNECTION_STRING` to the connection string to be used to connect to the mongodb database.
    - Set `SERVER_PORT` to the port the server listen to.
2. Run `yarn build` to build the files.
3. Run `yarn start` to start the application.

-   You can run `yarn dev` to combine the 2 steps above, while listening to changes and restarting automatically.
    -   You need to run `yarn global add ts-node` once for this to run.

## Linting & Formatting

-   Run `yarn lint` to lint the code.
-   Run `yarn format` to format the code.

# API reference

## Get data by a string

`GET /:group/:searchString`

-   The data to be returned will belong to the given `group`.
-   The `key` of the object whose data will be returned will be the one which is most similar to the given `searchString`

_exaple request url_

`GET /countries/Greeec/`

_exaple response_

```json
{
    "key": "Greece",
    "similarity": 0.65,
    "data": [
        {
            "name": "population",
            "value": "10.72m"
        },
        {
            "name": "size",
            "value": "131.957 sq m"
        }
    ]
}
```

## Create data

`POST /:group/`

-   The data to be created will belong to the given `group`.

_example request url_

`POST /countries/`

_example request body_ (creating one entry):

```json
{
    "data": {
        "key": "Greece",
        "data": [
            {
                "name": "population",
                "value": "10.72m"
            },
            {
                "name": "size",
                "value": "131.957 sq m"
            }
        ]
    }
}
```

_example request body_ (creating multiple entries):

```json
{
    "data": [
        {
            "key": "Cyprus",
            "data": [
                {
                    "name": "population",
                    "value": "1.189m"
                },
                {
                    "name": "size",
                    "value": "9.251 sq m"
                }
            ]
        },
        {
            "key": "Greece",
            "data": [
                {
                    "name": "population",
                    "value": "10.72m"
                },
                {
                    "name": "size",
                    "value": "131.957 sq m"
                }
            ]
        }
    ]
}
```

The response has a status of `204` with no content.

## Delete all data

`DELETE /:group/`

-   All data of the given `group` will be deleted.

_example request url_

`DELETE /countries/`

The response has a status of `204` with no content.
