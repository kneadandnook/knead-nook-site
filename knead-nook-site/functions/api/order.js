export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    const name = payload.customerName || "";
    const email = payload.customerEmail || "";
    const phone = payload.customerPhone || "";
    const occasion = payload.occasion || "";
    const fulfillmentMethod = payload.fulfillmentMethod || "";
    const requestedDate = payload.requestedDate || "";
    const requestedTime = payload.requestedTime || "";
    const address = payload.deliveryAddress || "";
    const city = payload.deliveryCity || "";
    const state = payload.deliveryState || "";
    const zip = payload.deliveryZip || "";
    const specialWishes = payload.specialWishes || "";
    const allergenNotes = payload.allergenNotes || "";
    const estimatedTotal = payload.estimatedTotal || "";
    const items = Array.isArray(payload.items) ? payload.items : [];

    const itemLines = items.length
      ? items.map((item, index) => `
Item ${index + 1}
Category: ${item.category || ""}
Item: ${item.item || ""}
Size: ${item.size || ""}
Quantity: ${item.quantity || ""}
Unit Price: ${item.unitPrice || ""}
Line Total: ${item.lineTotal || ""}
`).join("\n-----------------\n")
      : "No items submitted.";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Knead & Nook <orders@kneadandnook.com>",
        to: ["kneadandnook@kneadandnook.com"],
        reply_to: email,
        subject: `New Order from ${name || "Website Customer"}`,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Occasion: ${occasion}
Fulfillment Method: ${fulfillmentMethod}
Requested Date: ${requestedDate}
Requested Time: ${requestedTime}

Address:
${address}
${city}, ${state} ${zip}

Special Wishes:
${specialWishes}

Allergen Notes:
${allergenNotes}

Estimated Total:
${estimatedTotal}

Items:
${itemLines}
        `.trim()
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: resendData.message || resendData.error || "Email failed to send."
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Order sent successfully."
    }));
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Order submission failed."
    }), { status: 500 });
  }
}