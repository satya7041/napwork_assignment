// CRUD operation code for all tasks

const { getDb, connectToDb } = require('./db');  // Import the getDb function to get the database instance

// Create a new user (for signup)

async function createUser(user) {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(user);
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Find a user by email (for login)
async function findUserByEmail(email) {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Failed to find user');
  }
}

// Create a new post (for posting content)
async function createPost(post) {
  try {
    const db = await getDb();
    const postsCollection = db.collection('posts');
     // Ensure that uploadTime is stored as a Date object
     const newPost = {
      ...post,
      uploadTime: new Date(),  // Automatically set the current date and time as the upload time
    };
    const result = await postsCollection.insertOne(newPost);
    return result;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}
// Fetch post (for getting content)

// Fetch Posts with optional filters
const fetchPosts = async ({ searchText, startDate, endDate, tags }) => {
  const db = await getDb();
  const postsCollection = db.collection('posts');

  // Build the query object
  let query = {};

  // Filter by search text (searches in 'postName' and 'description')
  if (searchText) {
    query.$or = [
      { postName: { $regex: searchText, $options: 'i' } },  // Case-insensitive search
      { description: { $regex: searchText, $options: 'i' } }
    ];
  }

  // Filter by date range (startDate and endDate)
  if (startDate || endDate) {
    query.uploadTime = {};
    if (startDate) query.uploadTime.$gte = new Date(startDate);
    if (endDate) query.uploadTime.$lte = new Date(endDate);
  }

  // Filter by tags
  if (tags && Array.isArray(tags) && tags.length > 0) {
    query.tags = { $in: tags };
  }

  // Fetch posts with the query object
  const posts = await postsCollection.find(query).toArray();
  return posts;
};


module.exports = { createUser, findUserByEmail, createPost, fetchPosts };
