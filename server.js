// const http = require('http');
// const { parse } = require('querystring');
// const { createUser, findUserByEmail, createPost, fetchPosts } = require('./crud');  // Import CRUD functions
// const { closeDb } = require('./db');  // Import closeDb function to close the connection
// const { parse: parseJson } = require('json5');  // To safely parse JSON body in POST requests

// const PORT = 5000;

// const server = http.createServer(async (req, res) => {
//   let body = '';
//   req.on('data', chunk => {
//     body += chunk;
//   });

//   req.on('end', async () => {
//     // Parse the body of the request if it's JSON
//     let data = {};
//     try {
//       if (body) data = parseJson(body);
//     } catch (error) {
//       res.writeHead(400, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ message: 'Invalid JSON' }));
//       return;
//     }

//     if (req.method === 'POST' && req.url === '/signup') {
//       // Signup API
//       const { name, email, password } = data;

//       if (!name || !email || !password) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Name, email, and password are required' }));
//         return;
//       }

//       try {
//         const existingUser = await findUserByEmail(email);
//         if (existingUser) {
//           res.writeHead(400, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: 'Email already in use' }));
//           return;
//         }

//         const result = await createUser({ name, email, password });
//         res.writeHead(201, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'User created successfully' }));
//       } catch (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Error during signup', error: err.message }));
//       }
//     } else if (req.method === 'POST' && req.url === '/login') {
//       // Login API
//       const { email, password } = data;

//       if (!email || !password) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Email and password are required' }));
//         return;
//       }

//       try {
//         const user = await findUserByEmail(email);
//         if (!user || user.password !== password) {
//           res.writeHead(400, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: 'Invalid email or password' }));
//           return;
//         }

//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Login successful' }));
//       } catch (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Error during login', error: err.message }));
//       }
//     } else if (req.method === 'POST' && req.url === '/post') {
//       // Post Content API
//       const { userId, postName, description, uploadTime, tags, imageUrl } = data;

//       if (!userId || !postName || !description || !uploadTime || !tags || !imageUrl) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'All fields are required' }));
//         return;
//       }

//       try {
//         const result = await createPost({ userId, postName, description, uploadTime, tags, imageUrl });
//         res.writeHead(201, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Post created successfully' }));
//       } catch (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Error creating post', error: err.message }));
//       }
//       // Handle GET /fetchContent (Fetch posts with filters)
//     }else if (req.method === 'GET' && req.url.startsWith('/fetchContent')) {
//         const queryParams = parse(req.url.split('?')[1]);
//   console.log("query parameters are: ", queryParams);
  
//         const { searchText, startDate, endDate, tags } = queryParams;
        
//         // Parse tags if they're provided (convert comma-separated string to array)
//         const parsedTags = tags ? tags.split(',') : [];
  
//         try {
//           const posts = await fetchPosts({
//             searchText,
//             startDate,
//             endDate,
//             tags: parsedTags
//           });
  
//           res.writeHead(200, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify(posts));
//         } catch (err) {
//           res.writeHead(500, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: 'Error fetching posts', error: err.message }));
//         }
//       } 
      
//       // Handle unknown routes

//       else {
//       res.writeHead(404, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ message: 'Route not found' }));
//     }
//   });
// });

// server.listen(PORT, async () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

//this is main code to run all operations
const http = require('http');
const { parse } = require('querystring');
const { createUser, findUserByEmail, createPost, fetchPosts } = require('./crud');  // Import CRUD functions
const { connectToDb, getDb, closeDb } = require('./db');  // Import connectToDb, getDb and closeDb functions
const { parse: parseJson } = require('json5');  // To safely parse JSON body in POST requests

const PORT = 5000;

const server = http.createServer(async (req, res) => {
  let body = '';
  req.on('data', temp => {
    body += temp;
  });

  req.on('end', async () => {
    // Parse the body of the request if it's JSON
    let data = {};
    try {
      if (body) data = parseJson(body);
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON' }));
      return;
    }

    //for signup---------------------------------------------------------

    if (req.method === 'POST' && req.url === '/signup') {
      // Signup API
      const { name, email, password } = data;

      if (!name || !email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Name, email, and password are required' }));
        return;
      }

      try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Email already in use' }));
          return;
        }

        const result = await createUser({ name, email, password });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created successfully' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error during signup', error: err.message }));
      }

      //for login--------------------------------------------------------
      
    } else if (req.method === 'POST' && req.url === '/login') {
      // Login API
      const { email, password } = data;
      
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Email and password are required' }));
        return;
      }

      try {
        const user = await findUserByEmail(email);
        if (!user || user.password !== password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid email or password' }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error during login', error: err.message }));
      }

      //for post data--------------------------------------------------------
      
    } else if (req.method === 'POST' && req.url === '/post') {
      // Post Content API
      const { userId, postName, description, uploadTime, tags, imageUrl } = data;

      if (!userId || !postName || !description || !uploadTime || !tags || !imageUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'All fields are required' }));
        return;
      }
      
      try {
        const result = await createPost({ userId, postName, description, uploadTime, tags, imageUrl });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Post created successfully' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error creating post', error: err.message }));
      }


      //for get data--------------------------------------------------------

    } else if (req.method === 'GET' && req.url.startsWith('/fetchContent')) {
      // Fetch Content API (with filters)
      const queryParams = parse(req.url.split('?')[1]);
      console.log("Query parameters: ", queryParams);

      const { searchText, startDate, endDate, tags } = queryParams;

      // Parse and validate dates
      const parsedStartDate = startDate ? new Date(startDate) : null;
      const parsedEndDate = endDate ? new Date(endDate) : null;

      if ((startDate && isNaN(parsedStartDate)) || (endDate && isNaN(parsedEndDate))) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid date format' }));
        return;
      }

      // Parse tags if they're provided (convert comma-separated string to array)
      const parsedTags = tags ? tags.split(',') : [];

      try {
        const posts = await fetchPosts({
          searchText,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          tags: parsedTags
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
      } catch (err) {
        console.error("Error fetching posts: ", err);  // Log detailed error
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching posts', error: err.message }));
      }

      // default value if anything goes wrong-----------------------------------------------
      
    } else {
      // Handle unknown routes
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  });
});

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // Make sure the connection is established before starting the server
  try {
    await connectToDb();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);  // Exit the process if the DB connection fails
  }
});
