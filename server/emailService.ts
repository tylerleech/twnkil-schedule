import { type Assignment } from "@shared/schema";
import { format } from "date-fns";

/**
 * Email service for sending assignment notifications
 * 
 * Note: This is a placeholder implementation. To enable actual email sending:
 * 1. Set up an email service integration (Resend, SendGrid, or Outlook)
 * 2. Add the appropriate API keys to environment variables
 * 3. Implement the sendEmail function with the chosen service
 */

interface EmailRecipient {
  name: string;
  email: string;
}

// TODO: Configure employee emails in settings
const EMPLOYEE_EMAILS: Record<string, string> = {
  tyler: process.env.TYLER_EMAIL || "tyler@company.com",
  nalleli: process.env.NALLELI_EMAIL || "nalleli@company.com",
  claudia: process.env.CLAUDIA_EMAIL || "claudia@company.com",
  ana: process.env.ANA_EMAIL || "ana@company.com",
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/**
 * Generate email HTML for weekly assignment notification
 */
function generateAssignmentEmailHTML(assignment: Assignment, employeeName: string, role: "audit" | "balance"): string {
  const weekDate = format(new Date(assignment.weekStartDate), "MMMM d, yyyy");
  const auditDay = DAY_NAMES[assignment.auditDay - 1];
  const auditDate = format(new Date(assignment.weekStartDate.getTime() + (assignment.auditDay - 1) * 24 * 60 * 60 * 1000), "EEEE, MMMM d");

  if (role === "audit") {
    const partner = assignment.auditEmployee1 === employeeName 
      ? assignment.auditEmployee2 
      : assignment.auditEmployee1;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📋 Weekly Task Assignment</h1>
            </div>
            <div class="content">
              <p>Hi ${employeeName.charAt(0).toUpperCase() + employeeName.slice(1)},</p>
              <p>You have been assigned to perform the <strong>Foreign Currency Audit</strong> for the week of ${weekDate}.</p>
              
              <div class="task-box">
                <h3 style="margin-top: 0; color: #3b82f6;">Foreign Currency Audit</h3>
                <p><strong>Partner:</strong> ${partner.charAt(0).toUpperCase() + partner.slice(1)}</p>
                <p><strong>Scheduled Date:</strong> ${auditDate}</p>
                <p><strong>Day:</strong> ${auditDay}</p>
              </div>

              <p>Please make sure you and your partner are available on ${auditDay} to complete this task.</p>
              
              <div class="footer">
                <p>This is an automated reminder from the Employee Task Scheduler</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Weekly Task Assignment</h1>
            </div>
            <div class="content">
              <p>Hi ${employeeName.charAt(0).toUpperCase() + employeeName.slice(1)},</p>
              <p>You have been assigned to perform the <strong>Branch Balance Check</strong> for the week of ${weekDate}.</p>
              
              <div class="task-box">
                <h3 style="margin-top: 0; color: #10b981;">Branch Balance Check</h3>
                <p><strong>Week:</strong> ${weekDate}</p>
                <p>Please complete the balance check at your earliest convenience during this week.</p>
              </div>

              <div class="footer">
                <p>This is an automated reminder from the Employee Task Scheduler</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

/**
 * Send email notification to an employee
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param htmlContent - HTML content of the email
 * 
 * TODO: Implement with chosen email service (Resend, SendGrid, or Outlook)
 */
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
  // Placeholder implementation
  console.log(`[EMAIL] Would send to ${to}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Content length: ${htmlContent.length} characters`);
  
  // TODO: Implement actual email sending
  // Example for Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'scheduler@company.com',
  //   to,
  //   subject,
  //   html: htmlContent,
  // });
  
  // Example for SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to,
  //   from: 'scheduler@company.com',
  //   subject,
  //   html: htmlContent,
  // });
}

/**
 * Send assignment notifications to all assigned employees
 */
export async function sendAssignmentNotifications(assignment: Assignment): Promise<void> {
  const weekDate = format(new Date(assignment.weekStartDate), "MMMM d, yyyy");
  
  try {
    // Send to audit employees
    const auditEmployee1Email = EMPLOYEE_EMAILS[assignment.auditEmployee1];
    const auditEmployee2Email = EMPLOYEE_EMAILS[assignment.auditEmployee2];
    
    if (auditEmployee1Email) {
      const html = generateAssignmentEmailHTML(assignment, assignment.auditEmployee1, "audit");
      await sendEmail(
        auditEmployee1Email,
        `Foreign Currency Audit Assignment - Week of ${weekDate}`,
        html
      );
    }
    
    if (auditEmployee2Email) {
      const html = generateAssignmentEmailHTML(assignment, assignment.auditEmployee2, "audit");
      await sendEmail(
        auditEmployee2Email,
        `Foreign Currency Audit Assignment - Week of ${weekDate}`,
        html
      );
    }
    
    // Send to balance check employee
    const balanceEmployeeEmail = EMPLOYEE_EMAILS[assignment.balanceCheckEmployee];
    if (balanceEmployeeEmail) {
      const html = generateAssignmentEmailHTML(assignment, assignment.balanceCheckEmployee, "balance");
      await sendEmail(
        balanceEmployeeEmail,
        `Branch Balance Check Assignment - Week of ${weekDate}`,
        html
      );
    }
    
    console.log(`Sent assignment notifications for week of ${weekDate}`);
  } catch (error) {
    console.error("Error sending assignment notifications:", error);
    throw error;
  }
}

/**
 * Send weekly reminder emails (to be scheduled)
 * This function can be called by a cron job or scheduled task
 */
export async function sendWeeklyReminders(): Promise<void> {
  // TODO: Implement scheduled reminders
  // This could be triggered by a cron job or scheduled task service
  console.log("[EMAIL] Weekly reminders would be sent here");
}
