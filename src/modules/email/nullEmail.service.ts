import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { TemplatesNames } from './enums/templates.enum';

/**
 * NullEmailService class is responsible for simulating email sending by saving email content
 * as plain files in the specified directories based on email templates.
 */
@Injectable()
export class NullEmailService {
  private readonly emailDir: string;

  constructor() {
    // Define the base directory where email files will be stored
    this.emailDir = join(__dirname, '..', '..', 'emailFiles');

    // Ensure directories for each email template are created
    const emailTemplatesNames = Object.values(TemplatesNames);
    emailTemplatesNames.forEach((templateName) => {
      const templateNameDir = join(this.emailDir, templateName);
      this.ensureDirectoryExists(templateNameDir);
    });
  }

  /**
   * Ensures that the specified directory exists. Creates the directory if it does not exist.
   * @param dir - The directory path to ensure existence.
   */
  private async ensureDirectoryExists(dir: string): Promise<void> {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory', err);
    }
  }

  /**
   * Sends a notification email by saving it as a file in the appropriate template directory.
   * @param toEmail - The recipient's email address.
   * @param subject - The email subject.
   * @param templateName - The template name for the email.
   * @param context - The context data for the email template.
   */
  async sendNotificationEmail(
    toEmail: string,
    subject: string,
    templateName: string,
    context?: object,
  ): Promise<void> {
    // Add email details to the context
    context['toEmail'] = toEmail;
    context['subject'] = subject;
    // Generate the filename for the email file
    const emailFilename = `${new Date(context['updated_at']).toISOString()}_${toEmail}.txt`;
    // Construct the path for the email file
    const emailPath = join(this.emailDir, templateName, emailFilename);
    // Generate the email content using the appropriate template
    const emailContent = this.sendMailFactory(templateName)(context);

    try {
      // Save the email content to the file
      await fs.writeFile(emailPath, emailContent);
      console.log(`Email saved to ${emailPath}`);
    } catch (err) {
      console.error('Error saving email', err);
    }
  }

  /**
   * Factory method to get the appropriate email template function based on the template name.
   * @param templateName - The template name.
   * @returns The email template function.
   */
  sendMailFactory(templateName: string) {
    if (templateName === TemplatesNames.APPLICATION_RECEIVED) {
      return this.applicationReceived;
    } else if (templateName === TemplatesNames.APPLICATION_RESOLVED) {
      return this.applicationResolved;
    }
  }

  /**
   * Generates the email content for the 'APPLICATION_RECEIVED' template.
   * @param param0 - The context data for the template.
   * @returns The formatted email content.
   */
  applicationReceived({ toEmail, subject, name, message, created_at }: any) {
    created_at = new Date(created_at);
    return `
    To: ${toEmail}\n
    Subject: ${subject}\n
    Hello, ${name}\n
    Your Message: ${message}\n
    Your application has been received at ${created_at.toLocaleString()}\n
    `;
  }

  /**
   * Generates the email content for the 'APPLICATION_RESOLVED' template.
   * @param param0 - The context data for the template.
   * @returns The formatted email content.
   */
  applicationResolved({
    toEmail,
    subject,
    name,
    message,
    updated_at,
    comment,
  }: any) {
    updated_at = new Date(updated_at);
    return `
    To: ${toEmail}\n
    Subject: ${subject}\n
    Hello, ${name}!\n
    Your Message: ${message}\n
    Your application has been Resolved at ${updated_at.toLocaleString()}\n
    Our Comment: ${comment}
    `;
  }
}
