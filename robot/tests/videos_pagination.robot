*** Settings ***
Documentation     Integration tests validating pagination behavior of the
...               video listing endpoint. Tests verify correct page slicing,
...               sorting consistency, boundary conditions, and fallback
...               handling for invalid query parameters.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Check That Pagination Is Consistent
    [Documentation]    Ensures pagination parameters correctly slice the dataset
    ...                and that page offsets correspond to the expected sorted
    ...                positions in the full dataset.

    [Tags]    api    pagination

    Create API Session

    # Request page 2 with limit 3 using deterministic sorting
    ${params}=    Create Dictionary    page=2    limit=3    sortBy=title    order=asc
    ${response}=    GET On Session    api    /videos    params=${params}
    ${video_data}=    Set Variable    ${response.json()}

    ${page_number: int}=    Set Variable    2
    ${limit_number: int}=    Set Variable    3

    Should Be Equal    ${video_data}[page]    ${page_number}
    Should Be Equal    ${video_data}[limit]    ${limit_number}
    Length Should Be    ${video_data}[data]    3

    # Fetch the entire dataset with identical sorting to compare offsets
    ${compare_params}=    Create Dictionary    sortBy=title    order=asc
    ${compare_response}=    GET On Session    api    /videos    params=${compare_params}
    ${compare_video_data}=    Set Variable    ${compare_response.json()}

    # Verify page offset matches the correct slice of the sorted dataset
    Should Be Equal    ${video_data}[data][0][title]      ${compare_video_data}[data][3][title]
    Should Be Equal    ${video_data}[data][1][title]      ${compare_video_data}[data][4][title]
    Should Be Equal    ${video_data}[data][2][title]      ${compare_video_data}[data][5][title]

    # Validate that total results fit within reported pagination bounds
    ${result}=    Evaluate    ${video_data}[totalPages] * ${video_data}[limit]
    ${total}=    Set Variable    ${compare_video_data}[total]
    Should Be True    ${total} <= ${result}

    # Request a page far beyond dataset bounds
    ${pages_out_range}=    Create Dictionary    page=10000    limit=1
    ${out_range_response}=    GET On Session    api    /videos    params=${pages_out_range}
    ${out_range_data}=    Set Variable    ${out_range_response.json()}

    ${out_range_number: int}=    Set Variable    10000
    Should Be Equal    ${out_range_data}[page]    ${out_range_number}
    Should Be Empty    ${out_range_data}[data]

    # Validate correct slicing at page boundary
    ${params_page_boundary}=    Create Dictionary    page=3    limit=3    sortBy=title    order=asc
    ${boundary_response}=    GET On Session    api    /videos    params=${params_page_boundary}
    ${boundary_data}=    Set Variable    ${boundary_response.json()}

    Should Be Equal    ${boundary_data}[data][0][title]      ${compare_video_data}[data][6][title]
    Should Be Equal    ${boundary_data}[data][1][title]      ${compare_video_data}[data][7][title]
    Should Be Equal    ${boundary_data}[data][2][title]      ${compare_video_data}[data][8][title]


Fetch Videos With Invalid Metainformation
    [Documentation]    Verifies that invalid pagination parameters fall back
    ...                to safe defaults defined by the API implementation.

    [Tags]    api    pagination

    Create API Session

    # Invalid query parameters that should trigger fallback behavior
    ${invalidParams}=    Create Dictionary
    ...    page=-1
    ...    limit=99999999999999999999
    ...    order=notcorrect
    ...    sortBy=100

    ${response}=    GET On Session    api    /videos    params=${invalidParams}
    Status Should Be    200    ${response}

    ${video_data}=    Set Variable    ${response.json()}

    ${page_number: int}=    Set Variable    1
    ${limit_number: int}=    Set Variable    10

    Should Be Equal    ${video_data}[page]    ${page_number}
    Should Be Equal    ${video_data}[limit]    ${limit_number}