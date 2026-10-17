
async function testRoot() {
    try {
        const response = await fetch('http://localhost:5000/');
        console.log('Status:', response.status);
        console.log('Body:', await response.text());
    } catch (error) {
        console.error('Error:', error);
    }
}
testRoot();
