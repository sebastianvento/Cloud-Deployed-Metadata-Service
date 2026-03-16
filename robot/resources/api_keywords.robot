*** Settings ***
Documentation     Shared API and database utility keywords used by Robot Framework tests.
...               These keywords encapsulate common setup operations such as
...               establishing an API session and triggering the migration pipeline.

Library           RequestsLibrary
Library           Process
Library           String
Library           Collections
Library           ../libraries/db_helper.py


*** Keywords ***
Create API Session
    [Documentation]    Establishes an HTTP session to the metadata service API.
    ...                The session alias allows reuse of the connection across requests.

    Create Session    api    http://localhost:3000

    # RequestsLibrary keyword:
    # Create Session <alias> <base_url>
    #
    # api                     → Session alias used in subsequent requests
    # http://localhost:3000  → Base URL of the local metadata service


Run Migration Script
    [Documentation]    Executes the ETL migration script that transfers legacy
    ...                PostgreSQL metadata into the MongoDB database.

    Run Process    npm    run    migrate    cwd=..

    # Process library keyword:
    # Run Process <command> <arguments>
    #
    # npm run migrate  → Executes the migration defined in package.json
    # cwd=..           → Ensures the command runs from the project root