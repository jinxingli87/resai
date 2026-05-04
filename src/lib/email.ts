import { Resend } from "resend";
import { formatCurrency, formatDate } from "./utils";
import type { OrderWithItems } from "@/types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function sendOrderConfirmation(order: OrderWithItems) {
  const itemsList = order.order_items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${item.product_name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${formatCurrency(item.price_cents)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0F172A;padding:32px 40px;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">ResAI</h1>
            <p style="color:#94a3b8;margin:4px 0 0;">AI Strategy &amp; Training</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#0F172A;margin:0 0 8px;font-size:20px;">Order Confirmed!</h2>
            <p style="color:#475569;margin:0 0 24px;">Thank you${order.customer_name ? `, ${order.customer_name}` : ""}. Your payment was successful.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;">ORDER #${order.id.slice(0, 8).toUpperCase()}</td>
                <td style="padding:12px 16px;font-size:13px;color:#64748b;text-align:right;">${formatDate(order.created_at)}</td>
              </tr>
              <tr><td colspan="2" style="padding:16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsList}
                  <tr>
                    <td style="padding:12px 0 0;font-weight:700;color:#0F172A;">Total</td>
                    <td style="padding:12px 0 0;font-weight:700;color:#0F172A;text-align:right;">${formatCurrency(order.total_cents)}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="color:#475569;margin:0 0 8px;">Our team will reach out within 1-2 business days to get started.</p>
            <p style="color:#475569;margin:0;">Questions? Reply to this email or contact us at <a href="mailto:foxglobe2023@gmail.com" style="color:#2563EB;">foxglobe2023@gmail.com</a></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;text-align:center;">
            <p style="color:#94a3b8;font-size:13px;margin:0;">© ${new Date().getFullYear()} ResAI. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getResend().emails.send({
    from: "ResAI <onboarding@resend.dev>",
    replyTo: "foxglobe2023@gmail.com",
    to: order.customer_email,
    subject: `Order Confirmed – ResAI #${order.id.slice(0, 8).toUpperCase()}`,
    html,
  });
}
