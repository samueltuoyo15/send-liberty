import { SendLiberty } from './src/index.js';

const API_KEY = 'sl_9ab50193_c2a2a927e97aebeb544836652dae2d58e9a95090f7e5b710167c4fe3';
const client = new SendLiberty(API_KEY);

async function testBasicEmail() {
    console.log('TEST: Basic email sending...');
    
    try {
        const result = await client.send({
            to: 'test@example.com',
            subject: 'Test Email from SendLiberty SDK',
            html: '<h1>Hello!</h1><p>This is a test email from SendLiberty SDK.</p>',
            from: 'noreply@yourdomain.com',
        });

        console.log('SUCCESS: Email sent successfully');
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR: Failed to send email');
        console.error('MESSAGE:', error.message);
        console.error('DETAILS:', error.response?.data || error);
        return false;
    }
}

async function testBatchEmail() {
    console.log('\nTEST: Batch email sending...');
    
    try {
        const result = await client.sendBatch({
            recipients: {},
            subject: 'Batch Test Email',
            html: '<p>This is a batch email test.</p>',
            from: 'noreply@yourdomain.com',
        });

        console.log('SUCCESS: Batch email sent successfully');
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR: Failed to send batch email');
        console.error('MESSAGE:', error.message);
        return false;
    }
}

async function testScheduledEmail() {
    console.log('\nTEST: Scheduled email sending...');
    
    const scheduledTime = new Date(Date.now() + 60 * 60 * 1000);
    
    try {
        const result = await client.send({
            to: 'test@example.com',
            subject: 'Scheduled Test Email',
            html: '<p>This email was scheduled.</p>',
            from: 'noreply@yourdomain.com',
            scheduledAt: scheduledTime,
        });

        console.log('SUCCESS: Email scheduled successfully');
        console.log('SCHEDULED FOR:', scheduledTime.toISOString());
        console.log('RESULT:', JSON.stringify(result, null, 2));
        return true;
    } catch (error: any) {
        console.error('ERROR: Failed to schedule email');
        console.error('MESSAGE:', error.message);
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
    console.log('Basic Email:', results.basic ? 'PASSED' : 'FAILED');
    console.log('Batch Email:', results.batch ? 'PASSED' : 'FAILED');
    console.log('Scheduled Email:', results.scheduled ? 'PASSED' : 'FAILED');
    console.log('='.repeat(60));
}

runAllTests();
