*** Settings ***
Documentation     Integration tests validating the SQL → MongoDB migration pipeline.
...               These tests verify that legacy metadata is migrated correctly
...               and that transformation rules are applied as expected.

Resource          ../resources/api_keywords.robot


*** Test Cases ***
Run Migration And Verify Data
    [Documentation]    Confirms that a known legacy video exists in the source database,
    ...                runs the migration script, and verifies the record appears in
    ...                the target MongoDB collection.

    [Tags]    api    migration

    ${source_exists}=    Legacy Video Exists    Deep Love
    Should Be True    ${source_exists}

    Run Migration Script

    ${target_exists}=    Video Exists    Deep Love
    Should Be True    ${target_exists}


Check That Genre Transformation Works
    [Documentation]    Validates that genre values returned by the API are normalized
    ...                during migration (lowercase and without leading/trailing spaces).

    [Tags]    api    migration

    Create API Session

    ${response}=    GET On Session    api    /videos
    ${video_data}=    Set Variable    ${response.json()}

    # Iterate through all returned videos and verify genre normalization rules
    FOR    ${video}    IN    @{video_data}[data]
        FOR    ${genre}    IN    @{video}[genres]

            # Genre values should be lowercase
            Should Be Lower Case    ${genre}

            # Genre values should not contain leading or trailing whitespace
            ${stripped}=    Strip String    ${genre}
            Should Be Equal    ${stripped}    ${genre}

        END
    END