import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      businessName,
      location,
      existingWebsite,
      services,
      projectDescription,
      idealTimeline,
      approximateBudget,
      howDidYouHear,
      selectedAddOns,
      selectedHourlyPackage,
    } = await request.json();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0080D0; border-bottom: 2px solid #0080D0; padding-bottom: 10px;">
          New Contact Form Submission
        </h1>
        
        <h2 style="color: #333; margin-top: 30px;">Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${phoneNumber}</td>
          </tr>
        </table>

        ${(businessName || location || existingWebsite) ? `
        <h2 style="color: #333; margin-top: 30px;">Business Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${businessName ? `
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Business Name:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${businessName}</td>
          </tr>
          ` : ''}
          ${location ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${location}</td>
          </tr>
          ` : ''}
          ${existingWebsite ? `
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Website:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="${existingWebsite}">${existingWebsite}</a></td>
          </tr>
          ` : ''}
        </table>
        ` : ''}

        <h2 style="color: #333; margin-top: 30px;">Project Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${services && services.length > 0 ? `
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Services:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${services.join(", ")}</td>
          </tr>
          ` : ''}
          ${projectDescription ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Description:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${projectDescription}</td>
          </tr>
          ` : ''}
          ${idealTimeline ? `
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Timeline:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${idealTimeline}</td>
          </tr>
          ` : ''}
          ${approximateBudget ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Budget:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${approximateBudget}</td>
          </tr>
          ` : ''}
        </table>

        ${selectedHourlyPackage ? `
        <h2 style="color: #333; margin-top: 30px;">Selected Package</h2>
        <div style="background: #f0f9ff; border-left: 4px solid #0080D0; padding: 15px; margin: 10px 0;">
          <h3 style="color: #0080D0; margin: 0 0 10px 0;">${selectedHourlyPackage.tier.toUpperCase()}</h3>
          <p style="margin: 5px 0;"><strong>Hours:</strong> ${selectedHourlyPackage.hoursIncluded}</p>
          <p style="margin: 5px 0;"><strong>Rate:</strong> ${selectedHourlyPackage.hourlyRate}</p>
          <p style="margin: 5px 0;"><strong>Total Cost:</strong> ${selectedHourlyPackage.totalCost}</p>
          ${selectedHourlyPackage.savings ? `<p style="margin: 5px 0;"><strong>Savings:</strong> ${selectedHourlyPackage.savings}</p>` : ''}
        </div>
        ` : ''}

        ${selectedAddOns && selectedAddOns.length > 0 ? `
        <h2 style="color: #333; margin-top: 30px;">Selected Add-Ons</h2>
        <ul style="list-style: none; padding: 0;">
          ${selectedAddOns.map((addon: any) => `
            <li style="background: #f5f5f5; padding: 10px; margin: 5px 0; border-left: 3px solid #0080D0;">
              <strong>${addon.name}</strong> - ${addon.rate}<br/>
              <span style="color: #666; font-size: 14px;">${addon.description}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        ${howDidYouHear ? `
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          <strong>How they heard about us:</strong> ${howDidYouHear}
        </p>
        ` : ''}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
          <p>This email was sent from the Platformz contact form</p>
        </div>
      </div>
    `;

    const fromEmail = process.env.SENDGRID_FROM_EMAIL || `noreply@${process.env.SENDGRID_DOMAIN || "platformz.us"}`;
    const isQuoteRequest = (services && services.length > 0) || businessName || selectedHourlyPackage;
    const emailType = isQuoteRequest ? "Quote Request" : "Contact Message";

    await sgMail.send({
      from: {
        name: `Platformz ${emailType}`,
        email: fromEmail,
      },
      to: process.env.PLATFORMZ_CONTACT_EMAIL || "info@platformz.us",
      replyTo: email,
      subject: `New ${emailType}: ${firstName} ${lastName}${businessName ? ` - ${businessName}` : ""}`,
      html: emailHtml,
    });

    await sgMail.send({
      from: {
        name: "Platformz",
        email: fromEmail,
      },
      to: email,
      subject: isQuoteRequest ? "We've Received Your Quote Request - Platformz" : "We've Received Your Message - Platformz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0080D0;">Thank you for your ${isQuoteRequest ? "quote request" : "message"}!</h1>
          <p>Hi ${firstName},</p>
          <p>We've received your ${isQuoteRequest ? "quote request" : "message"} and our team is reviewing your ${isQuoteRequest ? "requirements" : "inquiry"}. We'll get back to you within 24 hours${isQuoteRequest ? " with a detailed proposal" : ""}.</p>
          ${selectedHourlyPackage ? `
          <div style="background: #f0f9ff; border-left: 4px solid #0080D0; padding: 15px; margin: 20px 0;">
            <h3 style="color: #0080D0; margin: 0 0 10px 0;">Your Selected Package: ${selectedHourlyPackage.tier.toUpperCase()}</h3>
            <p style="margin: 5px 0;">${selectedHourlyPackage.hoursIncluded} at ${selectedHourlyPackage.hourlyRate} = ${selectedHourlyPackage.totalCost}</p>
          </div>
          ` : ''}
          <p>In the meantime, feel free to explore more about our services at <a href="https://platformz.us" style="color: #0080D0;">platformz.us</a>.</p>
          <p style="margin-top: 30px;">Best regards,<br/><strong>The Platformz Team</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">If you have any questions, reply to this email or contact us at <a href="mailto:info@platformz.us" style="color: #0080D0;">info@platformz.us</a></p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
