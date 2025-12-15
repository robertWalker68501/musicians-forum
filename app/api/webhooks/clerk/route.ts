import { headers } from 'next/headers';
import { Webhook } from 'svix';

import prisma from '@/lib/prisma';

// Narrowed event shape (good enough for user sync)
type ClerkWebhookEvent =
  | {
      type: 'user.created' | 'user.updated';
      data: {
        id: string;
        username: string | null;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
        primary_email_address_id: string | null;
        email_addresses: Array<{ id: string; email_address: string }>;
      };
    }
  | {
      type: 'user.deleted';
      data: {
        id: string;
      };
    };

function getPrimaryEmail(data: {
  primary_email_address_id: string | null;
  email_addresses: Array<{ id: string; email_address: string }>;
}) {
  const primaryId = data.primary_email_address_id;
  if (primaryId) {
    const primary = data.email_addresses.find((e) => e.id === primaryId);
    if (primary?.email_address) return primary.email_address;
  }
  // Fallback: first available email (helps avoid “No primary email…” failures)
  return data.email_addresses[0]?.email_address ?? null;
}

function getDisplayName(data: {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
}) {
  const full = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return full || data.username || null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return new Response('Missing CLERK_WEBHOOK_SIGNING_SECRET', {
      status: 500,
    });
  }

  // IMPORTANT: use raw body text for Svix verification
  const payload = await req.text();

  const h = await headers();
  const svix_id = h.get('svix-id');
  const svix_timestamp = h.get('svix-timestamp');
  const svix_signature = h.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  let evt: ClerkWebhookEvent;

  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email = getPrimaryEmail(evt.data);
      if (!email) {
        // If your Prisma schema requires email, skip gracefully (2xx avoids endless retries)
        return Response.json({ ok: true, skipped: 'no_email' });
      }

      const displayName = getDisplayName(evt.data);

      await prisma.user.upsert({
        where: { clerkId: evt.data.id },
        create: {
          clerkId: evt.data.id,
          email,
          username: evt.data.username,
          displayName,
          imageUrl: evt.data.image_url,
        },
        update: {
          email,
          username: evt.data.username,
          displayName,
          imageUrl: evt.data.image_url,
        },
      });

      return Response.json({ ok: true });
    }

    if (evt.type === 'user.deleted') {
      // Optional: delete your local record
      await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
      return Response.json({ ok: true });
    }

    // For other event types you haven’t handled yet
    return Response.json({ ok: true, ignored: evt.type });
  } catch (err) {
    console.error('Clerk webhook handler error:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }
}
