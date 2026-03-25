import { SendLiberty } from "./src/index.js"

const API_KEY = "YOUR_API_KEY_HERE"
const client = new SendLiberty(API_KEY)

const testEmails = {
    primary: "samueltuoyo9082@gmail.com",
    secondary: "tuoyosamuel9082@gmail.com"
}

async function testBasicEmail() {
    console.log("TEST 1: Basic Email Sending")
    console.log("-".repeat(60))

    try {
        const result = await client.send({
            to: testEmails.primary,
            subject: "SendLiberty Test - Basic Email",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #333;">Hello from SendLiberty!</h1>
                    <p>This is a test email sent via the SendLiberty SDK.</p>
                    <p>If you're seeing this, the basic email functionality is working perfectly!</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `,
            text: "Hello from SendLiberty! This is a test email.",
        })

        console.log("SUCCESS: Email sent")
        console.log("Response:", JSON.stringify(result, null, 2))
        return true
    } catch (error: any) {
        console.error("FAILED:", error.message)
        if (error.status) console.error("Status Code:", error.status)
        return false
    }
}

async function testBatchEmail() {
    console.log("\nTEST 2: Batch Email Sending")
    console.log("-".repeat(60))

    const recipients = [
        { name: "Samuel (Primary)", email: testEmails.primary },
        { name: "Samuel (Secondary)", email: testEmails.secondary },
    ]

    try {
        const result = await client.sendBatch({
            name: "SDK Test Batch",
            recipients: recipients.map((user) => ({
                to: user.email,
                subject: `SendLiberty Batch Test - Hello ${user.name}!`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1 style="color: #333;">Hi ${user.name}!</h1>
                        <p>This is a batch email test from SendLiberty SDK.</p>
                        <p>You're receiving this as part of a batch of ${recipients.length} emails.</p>
                        <hr style="margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">Batch sent at: ${new Date().toLocaleString()}</p>
                    </div>
                `,
                text: `Hi ${user.name}! This is a batch email test.`,
            })),
            batchSize: 10,
            batchDelayMs: 1000,
        })

        console.log("SUCCESS: Batch job created")
        console.log("Response:", JSON.stringify(result, null, 2))
        return true
    } catch (error: any) {
        console.error("FAILED:", error.message)
        if (error.status) console.error("Status Code:", error.status)
        return false
    }
}

async function testScheduledEmail() {
    console.log("\nTEST 3: Scheduled Email Sending")
    console.log("-".repeat(60))

    const scheduledTime = new Date(Date.now() + 2 * 60 * 1000)

    try {
        const result = await client.send({
            to: testEmails.secondary,
            subject: "SendLiberty Test - Scheduled Email",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #333;">Scheduled Email Test</h1>
                    <p>This email was scheduled to be sent at: <strong>${scheduledTime.toLocaleString()}</strong></p>
                    <p>If you're seeing this at the right time, scheduling works perfectly!</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Created at: ${new Date().toLocaleString()}</p>
                </div>
            `,
            text: `Scheduled email test. Should arrive at ${scheduledTime.toLocaleString()}`,
            scheduledAt: scheduledTime,
        })

        console.log(" SUCCESS: Email scheduled")
        console.log("Scheduled for:", scheduledTime.toLocaleString())
        console.log("Response:", JSON.stringify(result, null, 2))
        return true
    } catch (error: any) {
        console.error("FAILED:", error.message)
        if (error.status) console.error("Status Code:", error.status)
        return false
    }
}

async function testEmailWithCC() {
    console.log("\nTEST 4: Email with CC")
    console.log("-".repeat(60))

    try {
        const result = await client.send({
            to: testEmails.primary,
            cc: testEmails.secondary,
            subject: "SendLiberty Test - Email with CC",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #333;">CC Test</h1>
                    <p>This email was sent to ${testEmails.primary}</p>
                    <p>And CC'd to ${testEmails.secondary}</p>
                    <p>Both addresses should receive this email!</p>
                </div>
            `,
            text: "CC test email",
        })

        console.log(" SUCCESS: Email with CC sent")
        console.log("Response:", JSON.stringify(result, null, 2))
        return true
    } catch (error: any) {
        console.error("FAILED:", error.message)
        if (error.status) console.error("Status Code:", error.status)
        return false
    }
}

async function runAllTests() {
    console.log("\n" + "=".repeat(60))
    console.log("🚀 SendLiberty SDK Test Suite")
    console.log("=".repeat(60))
    console.log(`Testing with emails:`)
    console.log(`  Primary:   ${testEmails.primary}`)
    console.log(`  Secondary: ${testEmails.secondary}`)
    console.log("=".repeat(60) + "\n")

    const results = {
        basic: await testBasicEmail(),
        batch: await testBatchEmail(),
        scheduled: await testScheduledEmail(),
        cc: await testEmailWithCC(),
    }

    console.log("\n" + "=".repeat(60))
    console.log("📊 Test Results Summary")
    console.log("=".repeat(60))
    console.log(`Basic Email:     ${results.basic ? " PASSED" : "FAILED"}`)
    console.log(`Batch Email:     ${results.batch ? " PASSED" : "FAILED"}`)
    console.log(`Scheduled Email: ${results.scheduled ? " PASSED" : "FAILED"}`)
    console.log(`Email with CC:   ${results.cc ? " PASSED" : "FAILED"}`)
    console.log("=".repeat(60))

    const totalTests = Object.keys(results).length
    const passedTests = Object.values(results).filter(Boolean).length
    console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`)
    
    if (passedTests === totalTests) {
        console.log("🎉 All tests passed! SDK is working perfectly!\n")
    } else {
        console.log("⚠️  Some tests failed. Check the errors above.\n")
    }
}

runAllTests()
