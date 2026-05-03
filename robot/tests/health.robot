*** Settings ***
Documentation     Integration tests for the service health endpoint.
...               Verifies that the metadata service is reachable and
...               returns the expected status response.

Resource          ../resources/api_keywords.robot


*** Keywords ***
Call Health Endpoint
    [Documentation]    Calls the API health endpoint and returns the HTTP response object.

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=2.2.2.2

    ${response}=    GET On Session    api    /health    headers=${h1}

    RETURN    ${response}


*** Test Cases ***
Health Endpoint Status
    [Documentation]    Ensures the health endpoint responds with HTTP status 200.
    [Tags]    health

    ${response}=    Call Health Endpoint

    Status Should Be    200    ${response}


Health Endpoint Body
    [Documentation]    Verifies that the health endpoint response body contains
    ...                the expected service status value.

    [Tags]    health

    ${response}=    Call Health Endpoint
    ${body}=    Set Variable    ${response.json()}

    Should Be Equal    ${body}[status]    ok