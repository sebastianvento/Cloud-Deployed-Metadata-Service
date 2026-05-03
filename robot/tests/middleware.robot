*** Settings ***
Documentation     API integration tests validating middleware
...               

Resource          ../resources/api_keywords.robot

*** Test Cases ***
Test Rate Limiter
    [Documentation]    Ensures that the API limits requests accordingly

    [Tags]    api    limiter    limiting

    Create API Session

    ${h1}=    Create Dictionary    X-Forwarded-For=3.3.3.3
    
    VAR    ${rc}    0
    WHILE    ${rc} < 60
        ${response}=    GET On Session    api    /videos    headers=${h1}
        Status Should Be    200    ${response}
        ${rc}=    Evaluate    ${rc} + 1
    END

    Run Keyword And Expect Error    *HTTPError*429*    GET On Session    api    /videos    headers=${h1}