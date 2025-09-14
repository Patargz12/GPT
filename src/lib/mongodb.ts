// Import MongoDB client and options types
import { MongoClient, MongoClientOptions } from 'mongodb';

// ========================================
// ENVIRONMENT VARIABLE VALIDATION
// ========================================
// Check if MongoDB connection string exists in environment variables
// This prevents the app from starting if the database URL is missing
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Get the MongoDB connection string from environment variables
// Format: mongodb+srv://username:password@cluster.mongodb.net/database
const uri = process.env.MONGODB_URI;

// MongoDB client configuration options
// Configure SSL/TLS settings for secure connection to MongoDB Atlas
const options: MongoClientOptions = {
    // SSL/TLS Configuration - enhanced for SSL handshake issues
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,

    // Connection timeout settings (increased for SSL handshake)
    serverSelectionTimeoutMS: 10000, // 10 seconds
    connectTimeoutMS: 30000, // 30 seconds for SSL handshake
    socketTimeoutMS: 30000, // 30 seconds

    // Retry settings
    retryWrites: true,
    retryReads: true,

    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 1,

    // Additional options for stability
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000,
};

// ========================================
// CLIENT VARIABLES DECLARATION
// ========================================
// Declare variables that will hold our MongoDB client and connection promise
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ========================================
// ENVIRONMENT-SPECIFIC CONNECTION HANDLING
// ========================================
if (process.env.NODE_ENV === 'development') {
    // DEVELOPMENT MODE: Preserve connection across hot reloads
    // In development, Next.js hot module replacement (HMR) can cause modules to reload
    // Without this global variable, we'd create new connections on every reload

    // Extend the global object to include our MongoDB client promise
    // This TypeScript casting tells the compiler about our custom global property
    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    // Check if we already have a connection promise stored globally
    if (!globalWithMongo._mongoClientPromise) {
        // First time connecting - create new client and store the connection promise
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }

    // Use the existing connection promise (either just created or from previous reload)
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // PRODUCTION MODE: Create fresh connection
    // In production, we don't have hot reloads, so we can create a new connection
    // No need for global variables as the module won't be reloaded
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// ========================================
// EXPORT THE CONNECTION PROMISE
// ========================================
// Export the connection promise so other parts of our app can use it
// This is the main export that API routes will import to get database access
// Example usage: const client = await clientPromise;
export default clientPromise;

// ========================================
// CONNECTION TESTING UTILITY FUNCTION
// ========================================
// This function helps us verify that our MongoDB connection is working properly
// It's useful for debugging connection issues during development
export async function testConnection(): Promise<void> {
    try {
        console.log('🔄 Attempting to connect to MongoDB Atlas...');

        // Wait for the connection promise to resolve and get the connected client
        const client = await clientPromise;

        // Send a ping command to the 'admin' database to test connectivity
        // This is MongoDB's standard way to check if the connection is alive
        await client.db('admin').command({ ping: 1 });

        console.log('✅ Connected to MongoDB Atlas successfully!');

        // List all available databases in our MongoDB cluster
        // This helps us see what databases exist and confirms we have proper access
        const databases = await client.db().admin().listDatabases();
        console.log('📊 Available databases:', databases.databases.map(db => db.name));

    } catch (error: unknown) {
        console.error('❌ MongoDB connection failed:');

        // ========================================
        // DETAILED ERROR HANDLING
        // ========================================
        // Different types of MongoDB errors require different solutions
        // This detailed error handling helps developers quickly identify the issue

        if (error.name === 'MongoServerError') {
            // Server-side errors from MongoDB Atlas
            if (error.code === 8000) {
                console.error('🔐 Authentication failed: Invalid username or password');
                console.error('💡 Check your MongoDB Atlas credentials in the connection string');
            } else if (error.code === 13) {
                console.error('🚫 Authorization failed: User does not have permission');
                console.error('💡 Check user permissions in MongoDB Atlas');
            } else {
                console.error('🔧 Server error:', error.message);
            }
        } else if (error.name === 'MongoNetworkError') {
            // Network connectivity issues
            console.error('🌐 Network error: Cannot reach MongoDB Atlas');
            console.error('💡 Check your internet connection and MongoDB Atlas network access settings');
        } else if (error.name === 'MongoParseError') {
            // Connection string format issues
            console.error('📝 Connection string parse error:', error.message);
            console.error('💡 Check the format of your MONGODB_URI environment variable');
        } else if (error.code === 'ENOTFOUND') {
            // DNS resolution failures
            console.error('🔍 DNS resolution failed: Cannot find MongoDB Atlas host');
            console.error('💡 Check your connection string hostname');
        } else if (error.code === 'ECONNREFUSED') {
            // Connection rejected by MongoDB Atlas
            console.error('🚪 Connection refused: MongoDB Atlas rejected the connection');
            console.error('💡 Check your IP whitelist in MongoDB Atlas network access');
        } else {
            // Any other unexpected errors
            console.error('❓ Unexpected error:', error.message);
            console.error('🔍 Full error details:', error);
        }

        // Re-throw the error so calling code can handle it appropriately
        throw error;
    }
}

// ========================================
// HOW TO USE THIS MODULE
// ========================================
/*
In your API routes, import and use like this:

import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    // Get the connected MongoDB client
    const client = await clientPromise;
    
    // Access your specific database (replace 'dotagpt' with your database name)
    const db = client.db('dotagpt');
    
    // Access a collection (like a table in SQL databases)
    const users = db.collection('users');
    
    // Perform database operations
    const user = await users.findOne({ email: 'user@example.com' });
    const result = await users.insertOne({ name: 'John', email: 'john@example.com' });
}

To test the connection during development:
import { testConnection } from '@/lib/mongodb';
await testConnection(); // Will log connection status and available databases
*/