*** Settings ***
Documentation     Integration tests verifying correct sorting behavior of the
...               video listing endpoint.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Check That Ordering Is Right
    [Documentation]    Validates that the API returns videos sorted correctly
    ...                when ordering parameters are provided.

    [Tags]    api    sorting

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=9.9.9.9

    # Request videos sorted by title in descending order
    ${params}=    Create Dictionary
    ...    page=1
    ...    limit=10
    ...    order=desc
    ...    sortBy=title

    ${response}=    GET On Session    api    /videos    params=${params}    headers=${h1}
    ${video_data}=    Set Variable    ${response.json()}

    # Extract titles into a list to independently verify sorting
    ${listToSort}    Create list
    ...    ${video_data}[data][0][title]
    ...    ${video_data}[data][1][title]
    ...    ${video_data}[data][2][title]
    ...    ${video_data}[data][3][title]
    ...    ${video_data}[data][4][title]
    ...    ${video_data}[data][5][title]
    ...    ${video_data}[data][6][title]
    ...    ${video_data}[data][7][title]
    ...    ${video_data}[data][8][title]
    ...    ${video_data}[data][9][title]

    # Sort locally to calculate expected ordering
    Sort List    ${listToSort}
    Log    ${listToSort}

    Reverse List    ${listToSort}
    Log    ${listToSort}

    ${i: int}=    Set Variable    0

    # Compare expected ordering with API response ordering
    FOR    ${video}    IN    @{listToSort}
        Should Be Equal    ${video_data}[data][${i}][title]    ${video}
        ${i}=    Evaluate    ${i} + 1
    END