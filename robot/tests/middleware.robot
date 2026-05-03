*** Settings ***
Documentation     API integration tests validating middleware
...               

Resource          ../resources/api_keywords.robot

*** Test Cases ***
Test Rate Limiter
    [Documentation]    Ensures that the API limits requests accordingly

    [Tags]    disabled    api    limiter    limiting
    Skip    Rate limiter disabled for now

    Create API Session

    ${response1}=    GET On Session    api    /videos
    ${response2}=    GET On Session    api    /videos
    ${response3}=    GET On Session    api    /videos
    ${response4}=    GET On Session    api    /videos 
    ${response5}=    GET On Session    api    /videos
    Run Keyword And Expect Error    *429*    GET On Session    api    /videos
    
    Status Should Be    200    ${response1}
    Status Should Be    200    ${response2}
    Status Should Be    200    ${response3}
    Status Should Be    200    ${response4}
    Status Should Be    200    ${response5}