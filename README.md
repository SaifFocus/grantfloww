# GrantFlow AI

Create a polished, production-style web app called “GrantFlow AI”.

Purpose:

GrantFlow AI helps founders, creatives, freelancers, and small businesses turn a rough idea into a structured business concept, grant application draft, roadmap, contract checklist, and execution plan.

Important:

Build this WITHOUT login/auth for now. It should feel like a premium AI SaaS landing page + working MVP.

Design style:

Use a design language inspired by Lovable’s own modern website aesthetic combined with iOS glassmorphism.

Visual direction:

- Clean, futuristic, premium, soft, minimal

- White/light base with subtle gradients

- Glassy translucent cards

- Rounded corners, large spacing, smooth shadows

- Soft blurred background blobs

- iOS-style frosted glass panels

- Elegant typography

- Smooth scroll behavior

- Blurry lower page/section edges that gradually clear as the user scrolls

- Subtle animations, not too much

- Beautiful empty states

- High-end startup/SaaS feel

Main colors:

- White / off-white background

- Soft pink, purple, blue, and warm orange gradients

- Dark charcoal text

- Subtle glass borders

- Accent buttons with gradient backgrounds

App structure:

1. Hero Section

Create a beautiful hero section with:

Headline:

“Turn your idea into a fundable business.”

Subheadline:

“GrantFlow AI helps you structure your idea, prepare grant applications, map your business journey, and generate the next steps to launch.”

Primary CTA:

“Start building your plan”

Secondary CTA:

“See how it works”

Add a glassy floating preview card showing an example AI output:

- Business Summary

- Grant Draft

- Action Plan

- Contract Checklist

Use smooth scroll from CTA buttons to the generator section.

2. Problem Section

Create a section explaining the problem:

“Most people have ideas. Few know how to structure them, fund them, or execute them.”

Use 3 glass cards:

- “Unclear business structure”

- “Complicated grant applications”

- “No roadmap from idea to execution”

3. How It Works Section

Create 4 steps:

1. Describe your idea

2. Answer guided questions

3. Generate your launch plan

4. Track next steps

Each step should be in a glass card with small icons.

4. Main Generator Section

This is the core MVP.

Create a large frosted glass panel titled:

“Build your business plan”

Include a form with these fields:

- Business idea textarea

Placeholder:

“Example: I want to start a car export business from Sweden to Finland…”

- Business type dropdown:

Options:

Startup, Small business, Non-profit, Creative project, Tech product, Local service, E-commerce, Other

- Country/market input:

Placeholder:

“Example: Sweden, Denmark, EU, Middle East…”

- Funding goal input:

Placeholder:

“Example: €10,000”

- What do you need help with? Multi-select cards:

  - Business structure

  - Grant application

  - Contracts

  - Roadmap

  - Marketing

  - Financial planning

  - Investor pitch

- Stage dropdown:

Options:

Idea only, Researching, Already started, Need funding, Ready to launch

Button:

“Generate AI Launch Plan”

For now, simulate the AI output based on the user input. No real API required unless easy to add. When user clicks the button, generate a beautiful structured result section.

5. AI Output Section

After clicking generate, show animated loading for 2 seconds:

“Structuring your idea…”

“Finding funding angles…”

“Creating your roadmap…”

Then show these tabs or cards:

A. Business Concept

Include:

- Business name suggestion

- Short concept summary

- Target audience

- Revenue model

- Unique value proposition

B. Grant Application Draft

Include:

- Project title

- Problem statement

- Proposed solution

- Social/economic impact

- Why funding is needed

- Expected outcome

C. Business Roadmap

Show a timeline:

- Week 1: Validate idea

- Week 2: Define offer

- Week 3: Prepare documents

- Week 4: Apply for funding

- Month 2: Launch MVP

- Month 3: Start sales/partnerships

D. Contract & Legal Checklist

Show checklist items:

- Supplier agreement

- Client agreement

- NDA

- Partnership agreement

- Terms & conditions

- Privacy policy

Add note:

“Legal templates should be reviewed by a qualified professional.”

E. Goals & Milestones

Show progress-style cards:

- Validate business idea

- Prepare funding application

- Build brand identity

- Contact partners

- Submit first application

6. Dashboard Preview Section

Create a beautiful “future dashboard” section, but make it clear this is a preview.

Cards:

- Active applications

- Upcoming deadlines

- Business milestones

- Documents needed

- AI recommendations

7. Footer

Minimal footer:

GrantFlow AI

“From idea to funding-ready execution.”

Add links:

Product, Grants, Roadmap, Contact

Interactions:

- Smooth scrolling

- Button hover animations

- Cards lift slightly on hover

- Glass sections fade in on scroll

- Lower edges of large sections should have a blurred gradient overlay that clears/reveals content as scrolling continues

- Form output should animate in cleanly

- Make everything responsive and beautiful on mobile

Technical requirements:

- Use React + Tailwind

- Use shadcn/ui components where useful

- Use lucide-react icons

- No login

- No database

- No payment

- Store generated result in local state only

- Make the generated output feel personalized using the user’s input

- Make sure the UI feels complete, not like a wireframe

Tone:

Professional, inspiring, premium, useful.

Main goal:

This should look impressive enough for a 1-hour hackathon demo. The app should instantly communicate:

“I can turn a vague idea into a structured business and grant execution plan.”

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://grantfloww.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a7a2648-95ff-41b2-8aff-d4ffeb649b6a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
