# MongoDB Atlas Setup Guide (Recommended)

## Step 1: Create Account

1. Go to https://cloud.mongodb.com/
2. Click "Try Free"
3. Sign up with email or Google

## Step 2: Create Cluster

1. Choose "M0 Sandbox" (Free tier)
2. Select a cloud provider (AWS recommended)
3. Choose a region close to you
4. Name your cluster (e.g., "dotagpt-cluster")
5. Click "Create Cluster"

## Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `dotagpt_user`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add your current IP address
5. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Clusters" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Replace `<dbname>` with `dotagpt`

## Example Connection String:

```
mongodb+srv://dotagpt_user:YOUR_PASSWORD@dotagpt-cluster.xxxxx.mongodb.net/dotagpt?retryWrites=true&w=majority
```

## Step 6: Update .env File

Replace the MONGODB_URI in your .env file with the Atlas connection string.
