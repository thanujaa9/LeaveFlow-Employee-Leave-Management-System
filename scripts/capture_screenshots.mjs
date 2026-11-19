import puppeteer from './frontend/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, 'docs', 'screenshots');

const employeeUser = {
  id: 2,
  employeeId: 'EMP-1042',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@leaveflow.com',
  role: 'EMPLOYEE',
  department: 'Engineering',
  designation: 'Staff Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  phone: '+91 98452 33112',
  joiningDate: '2022-06-01',
};

const adminUser = {
  id: 1,
  employeeId: 'EMP-1001',
  name: 'Priya Nair',
  email: 'priya.nair@leaveflow.com',
  role: 'ADMIN',
  department: 'People & Culture',
  designation: 'Head of Human Resources',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  phone: '+91 98201 44521',
  joiningDate: '2021-03-15',
};

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2, // 2x Retina resolution
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log('Capturing 01_login.png...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '01_login.png'), fullPage: false });

  console.log('Capturing 02_employee_dashboard.png...');
  await page.evaluate((u) => {
    localStorage.setItem('leaveflow_user', JSON.stringify(u));
    localStorage.setItem('leaveflow_token', 'mock-demo-token-employee');
  }, employeeUser);
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '02_employee_dashboard.png'), fullPage: false });

  console.log('Capturing 03_apply_leave.png...');
  await page.goto('http://localhost:3000/apply', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '03_apply_leave.png'), fullPage: false });

  console.log('Capturing 04_leave_history.png...');
  await page.goto('http://localhost:3000/history', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '04_leave_history.png'), fullPage: false });

  console.log('Capturing 05_team_calendar.png...');
  await page.goto('http://localhost:3000/calendar', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '05_team_calendar.png'), fullPage: false });

  console.log('Capturing 06_admin_dashboard.png...');
  await page.evaluate((u) => {
    localStorage.setItem('leaveflow_user', JSON.stringify(u));
    localStorage.setItem('leaveflow_token', 'mock-demo-token-admin');
  }, adminUser);
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '06_admin_dashboard.png'), fullPage: false });

  console.log('Capturing 07_workforce_directory.png...');
  await page.goto('http://localhost:3000/admin/employees', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, '07_workforce_directory.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots/!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
