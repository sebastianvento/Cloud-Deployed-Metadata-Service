*** Settings ***
Documentation     API integration tests validating error-handling behavior
...               of the video retrieval endpoint.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Fetch With Invalid Id
    [Documentation]    Ensures that the API returns an HTTP 400 error when an
    ...                invalid video identifier is provided.

    [Tags]    api    error-handling

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=6.6.6.6

    # Invalid identifier that does not match MongoDB ObjectId format
    ${video_id}    Set Variable    test

    Run Keyword And Expect Error
    ...    STARTS: HTTPError: 400 Client Error:
    ...    GET On Session    api    /videos/${video_id}    headers=${h1}


Fetch With Valid Id But Resource Does Not Exists
    [Documentation]    Ensures that the API returns HTTP 404 when a syntactically
    ...                valid identifier is provided but the resource does not exist.

    [Tags]    api    error-handling

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=6.6.6.6

    # Valid MongoDB ObjectId format but not present in the database
    ${video_id}    Set Variable    507f1f77bcf86cd799439011

    Run Keyword And Expect Error
    ...    STARTS: HTTPError: 404 Client Error:
    ...    GET On Session    api    /videos/${video_id}    headers=${h1}