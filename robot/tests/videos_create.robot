*** Settings ***
Documentation     API integration tests for video resource creation and retrieval.
...               Validates that a new video can be created via the API and
...               subsequently retrieved from the metadata service.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Create Video And Fetch It
    [Documentation]    Creates a new video through the API and verifies that the
    ...                resource can be retrieved with identical metadata.

    [Tags]    api    happy-path

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=5.5.5.5

    # Generate a unique timestamp to ensure test data uniqueness
    ${timestamp}=    Get Time    epoch

    ${genres}=    Create List    test

    ${title}=    Set Variable    Robot Test Movie ${timestamp}

    # Construct request payload for video creation
    ${payload}=    Create Dictionary
    ...    title=${title}
    ...    description=Created by Robot test
    ...    releaseYear=2025
    ...    durationMinutes=100
    ...    genres=${genres}
    ...    createdAt=2025-01-01T00:00:00Z
    ...    migratedAt=2025-01-01T00:00:00Z

    # Create video via POST /videos
    ${response}=    POST On Session    api    /videos    json=${payload}    headers=${h1}
    Status Should Be    201    ${response}

    # Extract created video identifier from response
    ${body}=    Set Variable    ${response.json()}
    ${video_id}=    Set Variable    ${body}[_id]

    Log    Created video id: ${video_id}

    # Retrieve created video via GET /videos/{id}
    ${get_response}=    GET On Session    api    /videos/${video_id}    headers=${h1}
    Status Should Be    200    ${get_response}

    ${video}=    Set Variable    ${get_response.json()}

    # Validate that stored metadata matches the created resource
    Should Be Equal    ${video}[title]    ${title}

    # Confirm persistence through database verification keyword
    ${exists}=    Video Exists    ${title}
    Should Be True    ${exists}