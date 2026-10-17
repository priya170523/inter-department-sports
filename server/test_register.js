// Native fetch in Node 24

async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Debug User",
                email: "debug" + Date.now() + "@test.com",
                password: "password123",
                registrationNumber: "REG123",
                department: "Debug Dept",
                phone: "1234567890"
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log(`Status: ${status}`);
        console.log(`Body: ${text.substring(0, 1000)}`); // Print first 1000 chars
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testRegister();
