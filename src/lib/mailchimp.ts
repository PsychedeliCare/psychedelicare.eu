import { mailchimpSubscriberHash } from "./md5";

export type MailchimpSubscribeResult =
  | { ok: true; status: "subscribed" | "updated" }
  | {
      ok: false;
      code: "invalid_email" | "already_subscribed" | "api_error" | "not_configured";
    };

type MailchimpConfig = {
  apiKey: string;
  serverPrefix: string;
  listId: string;
};

type MailchimpErrorBody = {
  title?: string;
  detail?: string;
  status?: number;
};

function getAuthHeader(apiKey: string) {
  return `Basic ${btoa(`anystring:${apiKey}`)}`;
}

function parseMailchimpError(body: MailchimpErrorBody) {
  if (body.title === "Member Exists") {
    return "already_subscribed" as const;
  }

  if (body.title === "Invalid Resource" && body.detail?.includes("looks fake or invalid")) {
    return "invalid_email" as const;
  }

  return "api_error" as const;
}

export async function subscribeToMailchimp(
  email: string,
  options: MailchimpConfig & { language?: string },
): Promise<MailchimpSubscribeResult> {
  const { apiKey, serverPrefix, listId, language } = options;

  if (!apiKey || !serverPrefix || !listId) {
    return { ok: false, code: "not_configured" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const subscriberHash = mailchimpSubscriberHash(normalizedEmail);
  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: getAuthHeader(apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: normalizedEmail,
      status_if_new: "subscribed",
      status: "subscribed",
      ...(language ? { language } : {}),
    }),
  });

  if (response.ok) {
    return { ok: true, status: response.status === 200 ? "updated" : "subscribed" };
  }

  let errorBody: MailchimpErrorBody = {};

  try {
    errorBody = (await response.json()) as MailchimpErrorBody;
  } catch {
    return { ok: false, code: "api_error" };
  }

  return { ok: false, code: parseMailchimpError(errorBody) };
}
