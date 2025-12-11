WITH exploded_tags AS (
    SELECT 
        TICKET_ID,
        TICKET_TAGS,
        TRIM(f.VALUE::STRING) AS TAG
    FROM FUNCTIONAL.PRODUCT_SUPPORT.FACT_TICKETS,
    LATERAL FLATTEN(input => TICKET_TAGS) f
    WHERE instance_account_id = 11195643 
        --AND TICKET_FULL_RESOLUTION_TIME_IN_MINUTES < 60
        AND CREATED_DATE > '2025-09-30'
        AND TICKET_TAGS IS NOT NULL
        AND TICKET_CHANNEL = 'Web form'
        and TICKET_FULL_RESOLUTION_TIME_IN_MINUTES < 5
        --AND TICKET_CHANNEL = 'LabelledPhone call inbound'
        --and TICKET_FULL_RESOLUTION_TIME_IN_MINUTES < 60
        --AND TICKET_CHANNEL IN ('LabelledPhone call inbound','LabelledPhone call outbound','Voicemail')

),

-- Step 2: Get top 100 most used tags
top_tags AS (
    SELECT 
        TAG,
        COUNT(1) AS TAG_COUNT,
        COUNT(DISTINCT TICKET_ID) AS UNIQUE_TICKETS,
        ROUND(COUNT(DISTINCT TICKET_ID) * 100.0 / 
            (SELECT COUNT(DISTINCT TICKET_ID) FROM exploded_tags), 2) AS PCT_OF_TICKETS
    FROM exploded_tags
    GROUP BY TAG
    ORDER BY TAG_COUNT DESC
    LIMIT 100
)

SELECT TAG,PCT_OF_TICKETS FROM top_tags
WHERE tag not in ('illinois','1-833-376-1333','english','pennsylvania','ibm_agent','chicago_branch','active','branch_admin','admin','great_plains','illinois_work_state','illinois_home_state','ohio')
ORDER BY TAG_COUNT DESC
