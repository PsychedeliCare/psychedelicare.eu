import type { APIRoute } from "astro";

import { subscribeToMailchimp } from "../../../lib/mailchimp";
import { normalizeLocale } from "../../../lib/i18n";

export const prerender = false;

type SubscribeRequest = {
  email?: string;
  consent?: boolean;
  locale?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: SubscribeRequest;

  try {
    payload = (await request.json()) as SubscribeRequest;
  } catch {
    return new Response(JSON.stringify({ ok: false, code: "invalid_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = payload.email?.trim() ?? "";
  const consent = payload.consent === true;
  const locale = normalizeLocale(payload.locale ?? "en");

  if (!consent) {
    return new Response(JSON.stringify({ ok: false, code: "consent_required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ ok: false, code: "invalid_email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const runtime = locals.runtime as {
    env: {
      MAILCHIMP_API_KEY?: string;
      MAILCHIMP_SERVER_PREFIX?: string;
      MAILCHIMP_LIST_ID?: string;
    };
  };

  const result = await subscribeToMailchimp(email, {
    apiKey: runtime.env.MAILCHIMP_API_KEY ?? "",
    serverPrefix: runtime.env.MAILCHIMP_SERVER_PREFIX ?? "",
    listId: runtime.env.MAILCHIMP_LIST_ID ?? "",
    language: locale,
  });

  if (result.ok) {
    return new Response(JSON.stringify({ ok: true, status: result.status }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const status = result.code === "not_configured" ? 503 : 400;

  return new Response(JSON.stringify({ ok: false, code: result.code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
