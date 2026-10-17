
async function testAuthGet() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/test');
        console.log('Status:', response.status);
        console.log('Body:', await response.text());
    } catch (error) {
        console.error('Error:', error);
    }
}
testAuthGet();
