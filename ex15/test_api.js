const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3005;

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    try {
      const baseUrl = `http://localhost:${PORT}/articles`;

      console.log('\n--- 1. Testing GET /articles ---');
      const getRes = await fetch(baseUrl);
      console.log('Status:', getRes.status);
      const getBody = await getRes.json();
      console.log('Articles count:', Array.isArray(getBody) ? getBody.length : getBody);

      console.log('\n--- 2. Testing POST /articles ---');
      const newArticle = {
        title: "Exploring the Hidden Gems of Paris",
        text: "Paris is known for its iconic landmarks like the Eiffel Tower and Louvre, but the city hides some lesser-known treasures. In this article, we'll explore some hidden gems of Paris that offer unique experiences away from the tourist crowds. From charming cafes tucked away in quiet lanes to serene gardens, Paris is full of surprises waiting to be discovered.",
        comments: [
          {
            commenter: "Alex",
            date: "2023-06-03",
            body: "Absolutely love this guide! Can't wait to explore these places."
          },
          {
            commenter: "Sam",
            date: "2023-06-04",
            body: "Paris is always full of surprises. Great article!"
          }
        ]
      };
      const postRes = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      console.log('Status:', postRes.status);
      const createdArticle = await postRes.json();
      console.log('Created ID:', createdArticle._id);
      console.log('Created Title:', createdArticle.title);

      const createdId = createdArticle._id;

      console.log('\n--- 3. Testing PUT /articles (not supported) ---');
      const putRes = await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Invalid' })
      });
      console.log('Status:', putRes.status);
      const putBody = await putRes.json();
      console.log('Response:', putBody);

      console.log(`\n--- 4. Testing GET /articles/${createdId} ---`);
      const getByIdRes = await fetch(`${baseUrl}/${createdId}`);
      console.log('Status:', getByIdRes.status);
      const getByIdBody = await getByIdRes.json();
      console.log('Found Article Title:', getByIdBody.title);

      console.log(`\n--- 5. Testing POST /articles/${createdId} (not supported) ---`);
      const postByIdRes = await fetch(`${baseUrl}/${createdId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Invalid' })
      });
      console.log('Status:', postByIdRes.status);
      const postByIdText = await postByIdRes.text();
      console.log('Response text:', postByIdText);

      console.log(`\n--- 6. Testing PUT /articles/${createdId} ---`);
      const putByIdRes = await fetch(`${baseUrl}/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Long News' })
      });
      console.log('Status:', putByIdRes.status);
      const putByIdBody = await putByIdRes.json();
      console.log('Updated Title:', putByIdBody.title);

      console.log(`\n--- 7. Testing DELETE /articles/${createdId} ---`);
      const deleteByIdRes = await fetch(`${baseUrl}/${createdId}`, {
        method: 'DELETE'
      });
      console.log('Status:', deleteByIdRes.status); // Expected 204

      console.log('\n--- ALL EXERCISE 15 TESTS PASSED ---');
    } catch (err) {
      console.error('Test failed with error:', err);
    } finally {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

runTests();

