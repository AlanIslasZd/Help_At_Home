
Help at Home (HAH) Business Consulting Engagement - Q4 2025

This repository documents the strategic consulting engagement with Help at Home, focusing on analyzing their current operational challenges, validating immediate tactical solutions, and roadmapping a future-state automated workflow.

1. Project Overview & Context

Client: Help at Home (HAH), a large home health care provider.

Core Challenge: HAH is facing 4M annual contacts with a mandate to reduce volume by 50% (to 2M).

Immediate Constraint: A strict OpEx budget freeze for the remainder of 2025. The client explicitly requested "tactical survival" solutions using existing tools, rather than expensive new AI software purchases.

Key Stakeholders:

Scott & Mike (Leadership): Focused on immediate cost reduction and maximizing current investments.

Nick & Bree (Admins/Builders): Have built a "Click-to-Chat" prototype in the legacy Flow Builder.

Jason & MQ (Architects): Require all integrations to go through a MuleSoft facade, not direct AMS connections.

2. Data Analysis & Insights

We performed a deep-dive analysis on ticket tag data to identify the true drivers of volume.

The "Async" Discovery:

Finding: 91% of tickets in the "CTA" group have 0 replies.

Root Cause: These are not support conversations; they are Visit Logs where agents manually document EVV (Electronic Visit Verification) exceptions.

Implication: HAH's "Support Volume" is artificially inflated by operational data entry.

Top Operational Intents (The "Big Rocks"):

We analyzed tag data (Untitled 1...0959.csv) to find the highest-volume operational tasks.

Top Drivers:

Visit Documentation (87%): Pure data entry.

Visit Confirmation (44%): Transactional updates.

EVV Exceptions (42%): Clock-in/out fixes.

Strategic Pivot: Automation shouldn't focus on generic "Chatbots"; it must focus on API Integrations (via MuleSoft) to handle these transactional updates without human touch.

Phone-Specific Insights (<60 min calls):

We analyzed short phone interactions (Untitled 1...1009.csv).

Finding: 37% of these calls are Abandoned.

Finding: 17% are simple Profile Updates.

Recommendation: Move profile management to the App (Self-Service) and implement automated callbacks to reduce abandonment.

3. The "Crawl, Walk, Run" Roadmap

We developed a 3-phase maturity model tailored to their budget constraints.

Phase 1: "Crawl" (Tactical Survival - Q4 2025)

Objective: Reduce Average Handle Time (AHT) immediately with $0 new spend.

Solution: Validate and deploy Nick's "Click-to-Chat" Prototype (Legacy Flow Builder).

Key Technical Win: Implement JWT Authentication in the mobile app. This passes the User ID to Zendesk automatically, eliminating the "Who are you?" discovery phase for agents.

Phase 2: "Walk" (Intelligent Triage - 2026)

Objective: Introduce Intent Recognition and Data Validation.

Solution: Migrate to Advanced AI Agents.

Workflow:

AI detects intent (e.g., "I missed my clock-out").

MuleSoft Integration (Read-Only): System validates the shift exists in the backend AMS.

Guided Handoff: Agent receives a "Smart Ticket" with verified data, ready for approval.

Phase 3: "Run" (Autonomous Orchestration - Future)

Objective: Zero-Touch Resolution for high-volume operational tasks.

Use Case: Shift Call-Outs (Cancellations).

Workflow:

Caregiver reports absence via App.

MuleSoft updates AMS to "Cancelled" automatically.

Backend Automation: Triggers the "AI Replacer Algorithm" to find and text a substitute caregiver instantly.

Ticket auto-solves without human intervention.

4. Key Artifacts Generated

Architecture Diagrams (Mermaid): Visualized the workflow for "Crawl" (Manual Entry) vs. "Run" (MuleSoft + AI Orchestration).

Data Visualizations (Python/Seaborn): Generated charts highlighting "High-Volume Operational Intents" and "Phone Abandonment Rates" to prove the business case.

Presentation Deck: Created a tactical deck focusing on validating their current work (Phase 1) while selling the vision for the future (Phase 3).

5. Lessons Learned for Future Engagements

Listen for the "Budget Freeze": When a client says "no new spend," pivot immediately to optimizing their legacy tools (e.g., Flow Builder) to build trust. Trying to sell "Future AI" too early can damage credibility.

Data over Opinions: The client thought they had a "Support Volume" problem. Using their own tag data to categorize tickets as "Operational Data Entry" (Visit Logs) changed the conversation entirely. It shifted the solution from "We need a better chatbot" to "We need an integration layer."

Respect the Technical Constraints: Identifying the MuleSoft Facade requirement early (via the Architects Jason & MQ) prevented a technical roadmap rejection. Always ask: "Does Zendesk talk to the database directly, or is there a middleware layer?"

Validate the "Builder": Nick (the Admin) had already built a prototype. By explicitly validating his work as "Phase 1," we turned an internal champion into an ally, rather than replacing his work with an external vendor solution.

[Slides Shared on Dec 11 2025 with Ryann and Peter Neels](https://docs.google.com/presentation/d/1CGoD6OtKWuPes0ck5SvXTL0duX3LvCeN4eToLbhazP0/edit?usp=sharing)
- Slides Shared by Ryann with me[Help at Home Business Consulting RBA](https://docs.google.com/presentation/d/1ed48nFKbu8oanawswjSZP1I1IIJ5heC1bL5YRkXr7uk/edit?usp=sharing)
- Analysing the client's ticket tags [Help at Home - Tags Analysis](https://docs.google.com/spreadsheets/d/1TQ3tWHCmtjNfogdtVz1aoLSy-hcc20jvuMQvW5z6_u0/edit?usp=sharing)
- [Notebook used to build the slides](https://colab.research.google.com/drive/1CgBdErgm5q_6m8tOit8OOoeqVoW_nYZ9?usp=sharing)
- [Conversation with Gemini](https://gemini.google.com/app/714778f874f97956)
- [Gong_Transcript](https://docs.google.com/document/d/1mMhwSRr_wnPQ68X0gEfsiFcbBrX6G_bMhMDLTu-98zM/edit?usp=sharing)
- [Lucid Chart](https://lucid.app/lucidchart/b61c9e2a-c55e-457c-90af-6489d243064e/edit?view_items=BGLcc-8Seasw&page=0_0&invitationId=inv_0a461be1-17ab-4ed2-a820-903c7774ea82)
- [Tags Taxonomy](https://docs.google.com/document/d/1tNaDO218N5CqeaWvMbQ5cmLX7MV34ow-xJ4CgKyrfDY/edit?usp=sharing)
