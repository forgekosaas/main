export const AGENT_SKILL_MARKDOWN = `# Forgeko Site Discovery

Forgeko publishes machine-readable discovery metadata for AI agents and crawlers.

## Resources

- Homepage markdown: /llms.txt
- API catalog: /.well-known/api-catalog
- OpenAPI description: /openapi.json
- API documentation: /docs/api

## Use

Read the API catalog first, then follow service-desc for OpenAPI details and service-doc for human-readable API notes. Use the waitlist API only for explicit user-directed signup actions.
`;

const AGENT_SKILL_DIGEST = "sha256:cd2f598d46c137238bee4b5145787c19da1038b20f048cd8c97af8eda8367453";

export function getDiscoveryLinkHeader() {
  return [
    "</.well-known/api-catalog>; rel=\"api-catalog\"",
    "</openapi.json>; rel=\"service-desc\"; type=\"application/openapi+json\"",
    "</docs/api>; rel=\"service-doc\"; type=\"text/html\"",
    "</llms.txt>; rel=\"describedby\"; type=\"text/markdown\"",
    "</.well-known/agent-skills/index.json>; rel=\"describedby\"; type=\"application/json\""
  ].join(", ");
}

export function getApiCatalog(siteUrl: string) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    linkset: [
      {
        anchor: `${baseUrl}/api/waitlist`,
        "service-desc": [{ href: `${baseUrl}/openapi.json`, type: "application/openapi+json" }],
        "service-doc": [{ href: `${baseUrl}/docs/api`, type: "text/html" }],
        status: [{ href: `${baseUrl}/api/events`, type: "application/json" }]
      }
    ]
  };
}

export function getOpenApiDocument(siteUrl: string) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    openapi: "3.1.0",
    info: {
      title: "Forgeko Public API",
      version: "0.1.0",
      description: "Public endpoints for Forgeko waitlist signup and lightweight event collection."
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/api/waitlist": {
        post: {
          summary: "Join the Forgeko waitlist",
          operationId: "joinWaitlist",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "consentMarketing"],
                  properties: {
                    email: { type: "string", format: "email" },
                    consentMarketing: { type: "boolean", const: true },
                    source: { type: "string", enum: ["hero", "solution", "cta_final"] }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Signup created and welcome email sent." },
            "200": { description: "Email is already on the waitlist." },
            "400": { description: "Invalid email or missing consent." },
            "500": { description: "Waitlist service error." }
          }
        }
      },
      "/api/events": {
        post: {
          summary: "Record a public page event",
          operationId: "recordPageEvent",
          responses: {
            "204": { description: "Event accepted." },
            "400": { description: "Unsupported event." }
          }
        }
      }
    }
  };
}

export function getHomepageMarkdown(siteUrl: string) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return `# Forgeko

Forgeko is an AI-guided operating system for solo SaaS builders.

## What Forgeko does

- Validates SaaS ideas with AI-driven market and competitor analysis.
- Generates landing pages, brand identity, and core features from a strategic canvas.
- Helps configure payments, domain, SSL, and growth analytics without coordination overhead.
- Keeps persistent Project Memory so decisions, approvals, and milestones carry forward.

## Who Forgeko is for

Forgeko is for solo builders, developers, PMs, and designers who want to move from idea validation to first revenue without stitching together disconnected tools.

## Current status

Forgeko is in private development. The waitlist is open for early access members who want product updates and beta access.

## Agent-readable resources

- API catalog: ${baseUrl}/.well-known/api-catalog
- OpenAPI description: ${baseUrl}/openapi.json
- API documentation: ${baseUrl}/docs/api
- Agent skills index: ${baseUrl}/.well-known/agent-skills/index.json
- Waitlist: ${baseUrl}/#waitlist

## Contact

Use ${baseUrl}/security for security contact details and ${baseUrl}/privacy for privacy information.
`;
}

export function getMarkdownTokenCount(markdown: string) {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

export function getAgentSkillsIndex(siteUrl: string) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "forgeko-site-discovery",
        type: "skill-md",
        description: "Discovery instructions for Forgeko public agent-readable resources.",
        url: `${baseUrl}/.well-known/agent-skills/forgeko-site-discovery/SKILL.md`,
        digest: AGENT_SKILL_DIGEST
      }
    ]
  };
}

export function getSiteUrlFromRequest(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return normalizeSiteUrl(configuredUrl);
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "");
}
