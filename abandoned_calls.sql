SELECT
  IFF(
    ARRAY_SIZE(
      ARRAY_INTERSECTION(
        TICKET_TAGS,
        ARRAY_CONSTRUCT(
          'voice_abandoned_in_ivr',
          'voice_abandoned_in_queue',
          'voice_abandoned_in_voicemail',
          'abandoned_closed'
        )
      )
    ) > 0, 1, 0
  ) AS is_abandon,
  COUNT(*)/1000 AS ticket_count
FROM FUNCTIONAL.PRODUCT_SUPPORT.FACT_TICKETS
WHERE instance_account_id = 11195643
  AND created_date > '2025-09-30'
  AND ticket_full_resolution_time_in_minutes < 60
  AND TICKET_CHANNEL IN ('LabelledPhone call inbound','LabelledPhone call outbound','Voicemail')

  --AND NOT ARRAY_CONTAINS('yes__within_the_visit_documented_in_ams'::VARIANT, ticket_tags)
GROUP BY 1
ORDER BY 2 DESC;
