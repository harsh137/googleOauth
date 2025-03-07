import { test, expect } from '@playwright/test';

test.describe('GmailDashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/gmail'); // Adjust the URL to your app's URL
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'Hello');
      localStorage.setItem('id_token', 'Hello ID');
      localStorage.setItem('is_webview', 'false');
    });
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
    });
  });

  test('renders appbar when isWebView is false', async ({ page }) => {
    await expect(page.getByTestId('appbar')).toBeVisible();
  });

  // test('opens and closes the drawer', async ({ page }) => {
  //   await page.evaluate(() => window.matchMedia = jest.fn().mockReturnValue({ matches: true }));
  //   await page.getByTestId('menu-button').click();
  //   await expect(page.getByTestId('drawer')).toBeVisible();
  //   await page.getByTestId('All-Email').click();
  //   await expect(page.getByTestId('drawer')).not.toBeVisible();
  // });

  test('opens send email modal', async ({ page }) => {
    await page.getByTestId('send-email-button').click();
    await expect(page.getByTestId('send-modal')).toBeVisible();
  });

  test('navigates to another page when clicking on Gmail Dashboard', async ({ page }) => {
    await page.getByTestId('dashboard-title').click();
    // Add your assertion for navigation here
  });

  test('opens send email modal and fills out the form', async ({ page }) => {
    await page.getByTestId('send-email-button').click();
    await expect(page.getByTestId('send-modal')).toBeVisible();

    await page.fill('[aria-label="To"]', 'test@example.com');
    await page.fill('[aria-label="Subject"]', 'Test Subject');
    await page.fill('[aria-label="Body"]', 'This is a test email body.');

    await expect(page.getByLabel('To')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Subject')).toHaveValue('Test Subject');
    await expect(page.getByLabel('Body')).toHaveValue('This is a test email body.');
  });

  test('fetchEmails sets emails and loading state correctly', async ({ page }) => {
    const mockEmails = [
      { id: 1, title: 'guptaharsh1378@gmail.com', subject: 'harsh1', body: 'harsh11\n', labels: ['UNREAD', 'SENT', 'INBOX'] },
      { id: 2, title: 'guptaharsh137@gmail.com', subject: 'harsh2', body: 'harsh12\n', labels: ['UNREAD', 'SENT', 'INBOX'] },
    ];

    await page.route('http://10.24.211.62:3002/api/read-email', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ emails: mockEmails }),
      });
    });

    await page.reload();
    const emailItems = await page.getByTestId('email-item');
    await expect(page.getByTestId('loading')).not.toBeVisible();
    await expect(emailItems).toHaveCount(mockEmails.length);
  });

  test('fetchEmails handles errors and sets loading state correctly', async ({ page }) => {
    await page.route('http://10.24.211.62:3002/api/read-email', route => {
      route.abort();
    });

    await page.reload();
    await expect(page.getByText('guptaharsh1378@gmail.com')).not.toBeVisible();
    await expect(page.getByText('guptaharsh137@gmail.com')).not.toBeVisible();
  });

  test('opens modal, fills email details, and sends email successfully', async ({ page }) => {
    await page.getByText('Send Email').click();
    await expect(page.getByTestId('send-modal')).toBeVisible();

    await page.fill('[aria-label="To"]', 'recipient@example.com');
    await page.fill('[aria-label="Subject"]', 'Test Subject');
    await page.fill('[aria-label="Body"]', 'This is a test email body.');

    await page.route('http://10.24.211.62:3002/api/send-email', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Email sent successfully!' }),
      });
    });

    await page.getByTestId('send-email').click();
    await expect(page.getByTestId('send-modal')).not.toBeVisible();
  });
});