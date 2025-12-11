WITH ticket_flags AS (
  SELECT
    ticket_id,
    IFF(ARRAY_CONTAINS('pennsylvania'::variant, ticket_tags), 1, 0) AS is_pennsylvania,
    IFF(ARRAY_CONTAINS('illinois'::variant, ticket_tags), 1, 0) AS is_illinois,
    IFF(ARRAY_CONTAINS('georgia'::variant, ticket_tags), 1, 0) AS is_georgia,
    IFF(ARRAY_CONTAINS('indiana'::variant, ticket_tags), 1, 0) AS is_indiana,
    IFF(ARRAY_CONTAINS('new_york'::variant, ticket_tags), 1, 0) AS is_new_york,
    IFF(ARRAY_CONTAINS('great_plains'::variant, ticket_tags), 1, 0) AS is_great_plains,
    IFF(ARRAY_CONTAINS('philadelphia_branch'::variant, ticket_tags), 1, 0) AS is_philadelphia_branch,
    IFF(ARRAY_CONTAINS('edison_branch'::variant, ticket_tags), 1, 0) AS is_edison_branch,
    IFF(ARRAY_CONTAINS('chicago_branch'::variant, ticket_tags), 1, 0) AS is_chicago_branch,
    IFF(ARRAY_CONTAINS('scranton_branch'::variant, ticket_tags), 1, 0) AS is_scranton_branch,
    IFF(ARRAY_CONTAINS('williamsport_branch'::variant, ticket_tags), 1, 0) AS is_williamsport_branch,
    IFF(ARRAY_CONTAINS('pittsburgh_branch'::variant, ticket_tags), 1, 0) AS is_pittsburgh_branch,
    IFF(ARRAY_CONTAINS('ny_edison'::variant, ticket_tags), 1, 0) AS is_ny_edison,
    -- (Retain other indicators as in earlier examples...)
    IFF(
      ARRAY_SIZE(
        ARRAY_INTERSECTION(
          ticket_tags,
          ARRAY_CONSTRUCT(
            'voice_abandoned_in_ivr',
            'voice_abandoned_in_queue',
            'voice_abandoned_in_voicemail',
            'abandoned_closed'
          )
        )
      ) > 0, 1, 0
    ) AS is_abandoned,
    IFF(ARRAY_CONTAINS('after_hours'::variant, ticket_tags), 1, 0) AS is_afterhours,
    IFF(ARRAY_CONTAINS('caregiver'::variant, ticket_tags), 1, 0) AS is_caregiver
  FROM FUNCTIONAL.PRODUCT_SUPPORT.FACT_TICKETS
  WHERE instance_account_id = 11195643
    AND created_date > '2025-09-30'
    --AND ticket_full_resolution_time_in_minutes < 60
    --AND NOT ARRAY_CONTAINS('yes__within_the_visit_documented_in_ams'::VARIANT, ticket_tags)
),
unpivoted_flags AS (
  SELECT
    ticket_id,
    indicator_name,
    indicator_value
  FROM ticket_flags
  UNPIVOT (
    indicator_value FOR indicator_name IN (
      is_pennsylvania,
      is_illinois,
      is_georgia,
      is_indiana,
      is_new_york,
      is_great_plains,
      is_philadelphia_branch,
      is_edison_branch,
      is_chicago_branch,
      is_scranton_branch,
      is_williamsport_branch,
      is_pittsburgh_branch,
      is_ny_edison,
      is_abandoned,
      is_afterhours,
      is_caregiver
    )
  )
)
SELECT
  indicator_name,
  COUNT(*) AS value_count,
  SUM(indicator_value) AS flagged_tickets,
  ROUND(100 * SUM(indicator_value)::FLOAT / COUNT(*), 2) AS pct_flagged
FROM unpivoted_flags
GROUP BY indicator_name
ORDER BY flagged_tickets DESC;
