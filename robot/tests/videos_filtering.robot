*** Settings ***
Documentation     API integration tests validating filtering behavior
...               of the video retrieval endpoint.

Resource          ../resources/api_keywords.robot

*** Test Cases ***
Fetch With Filter
    [Documentation]    Ensures that the API returns a dataset with correct filtering.

    [Tags]    api    filtering

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=7.7.7.7

    # Initializing filter
    ${genre}    Set Variable    action

    ${params}=    Create Dictionary    genres=${genre}
    ${response}=    GET On Session    api    /videos    params=${params}    headers=${h1}
    ${video_data}=    Set Variable    ${response.json()}

    FOR    ${video}    IN    @{video_data}[data]
        Should Contain    ${video}[genres]    ${genre}
    END

Fetch With Multiple Filters
    [Documentation]    Ensures that the API returns a dataset with correct multifiltering.

    [Tags]    api    filtering

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=7.7.7.7

    # Initializing filter
    ${genre}    Set Variable    action
    ${durationMin}    Set Variable    120

    ${params}=    Create Dictionary    genres=${genre}    durationMin=${durationMin}
    ${response}=    GET On Session    api    /videos    params=${params}    headers=${h1}
    ${video_data}=    Set Variable    ${response.json()}

    FOR    ${video}    IN    @{video_data}[data]
        Should Contain    ${video}[genres]    ${genre}
        Should Be True    ${video}[durationMinutes] >= ${durationMin}
    END

Fetch With Invalid Filter
    [Documentation]    Ensures that system returns empty dataset caused by invalid filtering.

    [Tags]    api    filtering

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=7.7.7.7

    # Initializing filter
    ${invalidGenre}    Set Variable    invalidgenre

    ${params}=    Create Dictionary    genres=${invalidGenre}
    ${response}=    GET On Session    api    /videos    params=${params}    headers=${h1}
    ${video_data}=    Set Variable    ${response.json()}

    Should Be Empty    ${video_data}[data]