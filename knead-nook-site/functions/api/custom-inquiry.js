nexport async function onRequestPost(context) {
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

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Knead & Nook <kneadandnook@kneadandnook.com>",
        to: ["kneadandnook@kneadandnook.com"],
        reply_to: inquiryEmail,
        subject: `New Custom Inquiry from ${inquiryName || "Website Form"}`,
        text: `
Name: ${inquiryName}
Email: ${inquiryEmail}
Phone: ${inquiryPhone}
Event Type: ${inquiryEventType}
Date: ${inquiryDate}
Guest Count: ${inquiryGuestCount}

Details:
${inquiryDetails}

Notes:
${inquiryNotes}
        `.trim()
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: resendData.message || resendData.error || "Email failed to send."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Custom inquiry sent successfully."
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
