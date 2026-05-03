*** Settings ***
Documentation     Integration tests validating API input validation when
...               creating new video resources.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Create Video With Missing Fields
    [Documentation]    Ensures that creating a video with missing required
    ...                fields results in a server error and no resource is stored.

    [Tags]    api    validation

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=10.10.10.10

    ${genres}=    Create List    test

    ${title}=    Set Variable    ${EMPTY}

    # Payload missing required field "title"
    ${payload}=    Create Dictionary
    ...    description=Created by Robot test
    ...    releaseYear=2025
    ...    durationMinutes=100
    ...    genres=${genres}
    ...    createdAt=2025-01-01T00:00:00Z
    ...    migratedAt=2025-01-01T00:00:00Z

    Run Keyword And Expect Error
    ...    STARTS: HTTPError: 500 Server Error:
    ...    POST On Session    api    /videos    json=${payload}    headers=${h1}

    # Verify that no video was created in the database
    ${exists}=    Video Exists    ${title}
    Should Not Be True    ${exists}


Create Video With Invalid Fields
    [Documentation]    Verifies that invalid field values are rejected by the API.

    [Tags]    api    validation

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=10.10.10.10

    ${timestamp}=    Get Time    epoch

    ${genres}=    Create List    test

    ${title}=    Set Variable    Robot Test Movie ${timestamp}

    # Invalid value for releaseYear
    ${payload}=    Create Dictionary
    ...    description=Created by Robot test
    ...    releaseYear=-1
    ...    durationMinutes=100
    ...    genres=${genres}
    ...    createdAt=2025-01-01T00:00:00Z
    ...    migratedAt=2025-01-01T00:00:00Z

    Run Keyword And Expect Error
    ...    STARTS: HTTPError: 400 Client Error:
    ...    POST On Session    api    /videos    json=${payload}    headers=${h1}

    # Ensure resource was not created
    ${exists}=    Video Exists    ${title}
    Should Not Be True    ${exists}


Create Video With Invalid Types
    [Documentation]    Ensures that invalid data types in the request payload
    ...                cause the API to reject the request.

    [Tags]    api    validation

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=10.10.10.10

    ${timestamp}=    Get Time    epoch

    ${genres}=    Create List    test

    ${title}=    Set Variable    Robot Test Movie ${timestamp}

    ${wrongtypeyear}=    Set Variable    test

    # releaseYear provided with an invalid type
    ${payload}=    Create Dictionary
    ...    description=Created by Robot test
    ...    releaseYear=${wrongtypeyear}
    ...    durationMinutes=100
    ...    genres=${genres}
    ...    createdAt=2025-01-01T00:00:00Z
    ...    migratedAt=2025-01-01T00:00:00Z

    Run Keyword And Expect Error
    ...    STARTS: HTTPError: 400 Client Error:
    ...    POST On Session    api    /videos    json=${payload}    headers=${h1}

    # Confirm that the invalid request did not create a resource
    ${exists}=    Video Exists    ${title}
    Should Not Be True    ${exists}