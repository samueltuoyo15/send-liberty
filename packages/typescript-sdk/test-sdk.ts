import { SendLiberty } from './src/index.js';

const API_KEY = 'sl_9ab50193_c2a2a927e97aebeb544836652dae2d58e9a95090f7e5b710167c4fe3';
const client = new SendLiberty(API_KEY);

const users = [
    { name: 'Alice Johnson', email: 'samueltuoyo9082@gmail.com' },
    { name: 'Bob Smith', email: 'tuoyosamuel9082@gmail.com' },
];

async function testBasicEmail() {
    console.log('TEST: Basic email sending...');

    try {
        const result = await client.send({
            to: users[0].email,
            subject: 'Welcome to SendLiberty!',
            html: `<h1>Hi ${users[0].name}!</h1><p>Thanks for signing up. Your account is ready.</p>`,
            from: 'noreply@yourdomain.com',
        });

        console.log('SUCCESS: Email sent');
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR:', error.message, '| STATUS:', error.status);
        return false;
    }
}

async function testBatchEmail() {
    console.log('\nTEST: Batch email sending...');

    try {
        const result = await client.sendBatch({
            name: 'March Newsletter',
            recipients: users.map((user) => ({
                to: user.email,
                subject: `Hey ${user.name}, check out what's new!`,
                html: `<h1>Hi ${user.name}!</h1><p>Here's your monthly update from SendLiberty. We hope you're doing great!</p>`,
                from: 'newsletter@yourdomain.com',
            })),
            batchSize: 10,
            batchDelayMs: 1000,
        });

        console.log('SUCCESS: Batch job queued');
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR:', error.message, '| STATUS:', error.status);
        return false;
    }
}

async function testScheduledEmail() {
    console.log('\nTEST: Scheduled email sending...');

    const scheduledTime = new Date(Date.now() + 60 * 60 * 1000);

    try {
        const result = await client.send({
            to: users[1].email,
            subject: 'Your weekly digest is on the way',
            html: `<h1>Hi ${users[1].name}!</h1><p>Your weekly digest will arrive shortly.</p>`,
            from: 'digest@yourdomain.com',
            scheduledAt: scheduledTime,
        });

        console.log('SUCCESS: Email scheduled for', scheduledTime.toISOString());
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR:', error.message, '| STATUS:', error.status);
        return false;
    }
}

async function runAllTests() {
    console.log('='.repeat(60));
    console.log('SendLiberty SDK Test Suite');
    console.log('='.repeat(60));
    console.log();

    const results = {
        basic: await testBasicEmail(),
        batch: await testBatchEmail(),
        scheduled: await testScheduledEmail(),
    };

    console.log();
    console.log('='.repeat(60));
    console.log('Test Results Summary');
    console.log('='.repeat(60));
    console.log('Basic Email:    ', results.basic ? 'PASSED' : 'FAILED');
    console.log('Batch Email:    ', results.batch ? 'PASSED' : 'FAILED');
    console.log('Scheduled Email:', results.scheduled ? 'PASSED' : 'FAILED');
    console.log('='.repeat(60));
}

runAllTests();
