*** Settings ***
Documentation     Integration tests verifying correct behavior of
...               genres endpoint.

Resource          ../resources/api_keywords.robot

*** Test Cases ***
Fetch Genre Counts
    [Documentation]    Validates that the API returns correct amount of videos per genre sorted correctly.
    ...                

    [Tags]    api    genres

    Create API Session
    
    # Request genres and their video amounts
    ${responseGenres}=    GET On Session    api    /videos/stats/genres
    ${genre_data}=    Set Variable    ${responseGenres.json()}

    ${genre}    Set Variable    drama
    ${params}=    Create Dictionary    genres=${genre}
    ${response}=    GET On Session    api    /videos    params=${params}
    ${video_data}=    Set Variable    ${response.json()}
    ${length} =	Get Length	${video_data}[data]

    FOR    ${loopedGenre}    IN    @{genre_data}[data]
        IF    "${loopedGenre}[_id]" == "${genre}"
            Should Be Equal As Integers    ${loopedGenre}[count]    ${length}
        END
    END