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
      ? items.map((item, index) => {
          return [
            `Item ${index + 1}:`,
            `  Category: ${item.category || ""}`,
            `  Item: ${item.item || ""}`,
            `  Size: ${item.size || ""}`,
            `  Quantity: ${item.quantity || ""}`,
            `  Unit Price: ${item.unitPrice || ""}`,
            `  Line Total: ${item.lineTotal || ""}`
          ].join("\\n");
        }).join("\\n\\n")
      : "No cart items received.";

    console.log("NEW ORDER SUBMITTED");
    console.log({
      name,
      email,
      phone,
      occasion,
      fulfillmentMethod,
      requestedDate,
      requestedTime,
      address,
      city,
      state,
      zip,
      specialWishes,
      allergenNotes,
      estimatedTotal,
      items
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order received successfully."
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Order submission failed."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}