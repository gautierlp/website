---
name: "Evaboot"
client: "Evaboot"
logo: "/assets/images/image30.png"
summary: "Refactored Evaboot’s Bubble app, improved security, and streamlined ops, scaling from $1M to $2M ARR and freeing the founder to focus on growth."
result: "From $1M to $2M+"
resultLabel: "ARR"
links: [{"label": "Website", "url": "https://evaboot.com/"}]
useCases: ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"]
featured: true
order: 1
status: "live"
images: [{"src": "/assets/videos/video01.mp4", "alt": "User dashboard"}, {"src": "/assets/images/image06.jpg", "alt": "Admin dashboard"}, {"src": "/assets/images/image20.jpg", "alt": "Stripe integration"}]
highlights: [{"text": "Evaboot had reached $1M ARR but faced challenges scaling due to technical debt and operational bottlenecks. JB, one of the founders, was deeply involved in development, limiting his ability to focus on growth.", "image": "/assets/videos/video01.mp4", "caption": "User dashboard"}, {"text": "Evaboot needed to scale from $1M to $2M ARR but was struggling with a Bubble app burdened by technical debt, ongoing bugs, and security concerns. JB's involvement in app development made it difficult for him to prioritize strategic business tasks.", "image": "/assets/images/image06.jpg", "caption": "Admin dashboard"}, {"text": "Over the course of a year, I worked closely with JB to take over the technical management of the app. This included refactoring the codebase to eliminate technical debt, resolving critical bugs, enhancing security, improving the user experience, and integrating third-party tools like Stripe and Segment. These efforts allowed JB to delegate technical responsibilities and focus on scaling the business.", "image": "/assets/images/image20.jpg", "caption": "Stripe integration"}, {"text": "By optimizing the app and streamlining operations, Evaboot successfully reached its goal of $2M ARR. The technical improvements enabled the company to grow efficiently, while JB could concentrate on strategic growth initiatives.", "image": "", "caption": ""}]
quote: {"text": "Gautier expertly used Bubble.io to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble.io projects.", "who": "JB Jézéquel", "role": "Co-Founder, Evaboot"}
---

## Scaling Evaboot from $1M to $2M ARR with Bubble

![image.png](/assets/projects/evaboot/uhlni7bbredzeywk7cfk.webp)

**Jb Jézéquel** *Co-Founder* [@Evaboot](https://evaboot.com/)

⭐⭐⭐⭐⭐ “*Gautier expertly used Bubble to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble projects.*”

*Oct 18, 2024*

---

## Introduction

Evaboot is a B2B SaaS startup, built on Bubble. With no additional staff, the two founders managed to grow the company to $1M ARR. However, as the customer base and technical demands grew, managing the development and upkeep of the app became overwhelming.

<video controls muted playsinline src="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.mp4" poster="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.webp"></video>

At the $1M ARR milestone, the startup encountered scaling challenges. The Bubble application had accumulated technical debt and suffered from persistent bugs. Addressing these issues was essential for scaling from $1M to $2M ARR while safeguarding product stability and user satisfaction.

---

## Problem statement

### Core Challenges

The primary challenge was to reduce the technical load on one founder heavily involved in the Bubble app’s development. The application needed refactoring to clear technical debt and enhance scalability, security, and user experience. Additionally, the founders aimed to develop new features and third-party integrations to add user value.

![image](/assets/projects/evaboot/yeozsoqcr93m15jqq47s.webp)

### Key Business Risks

If these technical issues went unresolved, there was a risk of stagnation.

---

## Solution

### Approach

The approach taken was systematic, addressing both immediate technical issues and positioning the app for future growth. The goal was to offload the founder of day-to-day development by taking on ownership of the Bubble app. Work included refactoring, bug resolution, security enhancements, new feature development, and user experience improvements.

![image](/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp)

### Technical Refactoring on Bubble

- **Database Revamp**: Updated multiple tables to remove redundant fields, migrating data between fields and tables without service interruptions. Conducted data integrity checks through scripts on all tables and fields to ensure completeness and accuracy.

- **Query Optimization**: Implemented best practices on Bubble to prevent unnecessary data pulls, allowing the app to scale effectively. Optimized multi-fields for efficiency, keeping entry counts within optimal limits, and applied satellite data organization methods ([Petter Amlie](https://www.amliesolutions.com/bubble/advanced/satellite-data-types-in-bubble/)) to streamline database structure based on use case.

- **Data Triggers**: Added database triggers to maintain data consistency and automatically enforce structure, ensuring data is always neat and up-to-date.

- **Page Revamp**: Transitioned from a multi-page to a single-page app architecture, improving load times and navigation to align with SaaS industry standards for performance and user experience.

- **Front-End Optimization**: Applied advanced Bubble best practices by using reusable elements for common tasks (CRUD, etc.), improving readability, reducing side effects, and making maintenance easier. Implemented lazy loading and custom endpoints to load only necessary data, enhancing scalability and reducing operational costs under Bubble’s usage-based pricing.

- **Code Modularity and Cleanup**: Replaced many plugins with native Bubble functions to reduce dependency overhead and improve maintainability. Introduced a clear naming convention, enhancing code readability and facilitating future handovers to other developers.

- **API Error Handling**: Enhanced API integrations by adding error handling to catch and manage issues efficiently.

- **Scalability Enhancements**: Improved app performance under heavy loads through lazy loading and selective data fetching. Developed custom endpoints to load only relevant data, optimizing both app speed and usage costs.

- **UX Enhancements**: Standardized inputs, fonts, and colors to align with SaaS design norms, making the app more intuitive for users by adhering to familiar UI conventions.

- **Logging and Error Tracking**: Implemented a dedicated logging system within database tables to track user actions and capture errors in real-time. This enables swift issue resolution with comprehensive information on user actions and error specifics, improving debugging and overall response time to issues.

### Security Enhancements

- **API Security**: Redesigned the API calls so that tokens and routes stay on the server.

- **Privacy and Access Control**: Completely revamped privacy rules to ensure strict data access control, allowing only authorized users to access specific data. Optimized data loading on the front end to limit exposure, ensuring that only necessary information is displayed to users.

### Bug Fixes

A systematic approach to bug fixing improved the end-user and admin experience, making the product more reliable and user-friendly.

### New Feature Development

New features were introduced based on customer feedback and business objectives, ensuring the platform remained competitive and valuable.

- **More control for admins**: Dedicated admin dashboard, enhanced Stripe control from and to the app, LinkedIn integration for direct user information retrieval,

- **More data for owners**: Advanced tracking and data visualization for KPIs, integrations with Google Sheets, ...

- **More conversion**: "Pay on download" model, export preview functionality (using HTML, CSS)

- **More LTV**: Team management features, updated pricing model with legacy and new credits management, credits expiration policy, automated email enrichment, customizable email alerts (HTML, CSS), Integration of Intercom, ...

- **Less risks**: Export launch blocking to protect users' LinkedIn accounts from bans, export restrictions for abusive behavior (e.g., multiple free accounts or concurrent launches), ...

- **Experimental features**: Free trial, Referral system, ...

### User Experience Improvements

A revamped front-end was designed to enhance ease of use, creating a more intuitive experience for both customers and admins.

### Third-Party Integrations

Several third-party tools, including Stripe, Brevo, Segment, Google Tag Manager, and Google Sheets, were integrated on Bubble to streamline operations and improve app functionality.

---

## Implementation

To ensure seamless communication and efficient project management, the following structures were put in place:

- **Daily check-ins with the founder** to maintain open communication, address blockers, answer questions, and provide real-time insights on progress.

- **Weekly priority meetings** with the founder to align on goals and set clear priorities for the week.

- **Notion workspace** for task-specific updates, allowing transparent status tracking on each task.

- **Dedicated Slack channels** for focused discussions on specific topics, ensuring organized and accessible communication.

---

## Results

Within a year, revenue **doubled from $1M to $2M ARR** as the Bubble app became more stable, with reduced risk around downtime, bugs, and user support needs. Optimized for further scaling, the app now allows the founder to focus on strategic growth initiatives, positioning the business for continued expansion.
