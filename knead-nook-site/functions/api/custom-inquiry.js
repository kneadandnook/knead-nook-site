export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    const inquiryName = payload.inquiryName || "";
    const inquiryEmail = payload.inquiryEmail || "";
    const inquiryPhone = payload.inquiryPhone || "";
    const inquiryEventType = payload.inquiryEventType || "";
    const inquiryDate = payload.inquiryDate || "";
    const inquiryGuestCount = payload.inquiryGuestCount || "";
    const inquiryDetails = payload.inquiryDetails || "";
    const inquiryNotes = payload.inquiryNotes || "";

    console.log("CUSTOM ORDER INQUIRY");
    console.log({
      inquiryName,
      inquiryEmail,
      inquiryPhone,
      inquiryEventType,
      inquiryDate,
      inquiryGuestCount,
      inquiryDetails,
      inquiryNotes
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Custom inquiry received successfully."
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Custom inquiry submission failed."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}