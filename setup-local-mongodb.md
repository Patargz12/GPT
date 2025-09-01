# Local MongoDB Setup Guide

## Windows Installation

### Option A: MongoDB Community Server

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Default connection: `mongodb://localhost:27017`

### Option B: Using Docker (Recommended)

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo

# Connection string for Docker:
# mongodb://admin:password@localhost:27017/dotagpt?authSource=admin
```

### Option C: Using MongoDB Atlas Local (mongod)

```bash
# Install via npm (if you have Node.js)
npm install -g mongodb-memory-server

# Or use MongoDB Compass for GUI management
```

## Verify Installation

```bash
# Test connection
mongosh "mongodb://localhost:27017"
```
