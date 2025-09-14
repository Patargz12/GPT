import clientPromise from './mongodb';
import { Db, Collection, CreateCollectionOptions, CreateIndexesOptions } from 'mongodb';

// ========================================
// DATABASE CONNECTION HELPER
// ========================================
export async function getDatabase(dbName: string = 'dotagpt'): Promise<Db> {
    const client = await clientPromise;
    return client.db(dbName);
}

// ========================================
// COLLECTION MANAGEMENT
// ========================================
export async function createCollection(
    collectionName: string,
    options?: CreateCollectionOptions
): Promise<void> {
    try {
        const db = await getDatabase();
        await db.createCollection(collectionName, options);
        console.log(`✅ Collection '${collectionName}' created successfully`);
    } catch (error: unknown) {
        const mongoError = error as { code?: number };
        if (mongoError.code === 48) {
            console.log(`ℹ️ Collection '${collectionName}' already exists`);
        } else {
            throw error;
        }
    }
}

export async function deleteCollection(collectionName: string): Promise<void> {
    const db = await getDatabase();
    await db.collection(collectionName).drop();
    console.log(`🗑️ Collection '${collectionName}' deleted successfully`);
}

export async function listCollections(): Promise<unknown[]> {
    const db = await getDatabase();
    return await db.listCollections().toArray();
}

// ========================================
// DOCUMENT OPERATIONS
// ========================================
export async function insertDocument(
    collectionName: string,
    document: Record<string, unknown>
): Promise<unknown> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    console.log(`📝 Document inserted with ID: ${result.insertedId}`);
    return result;
}

export async function insertDocuments(
    collectionName: string,
    documents: Record<string, unknown>[]
): Promise<unknown> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertMany(documents);
    console.log(`📝 ${result.insertedCount} documents inserted`);
    return result;
}

export async function findDocuments(
    collectionName: string,
    filter: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
): Promise<unknown[]> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    return await collection.find(filter, options).toArray();
}

export async function findOneDocument(
    collectionName: string,
    filter: Record<string, unknown>
): Promise<unknown> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    return await collection.findOne(filter);
}

export async function updateDocument(
    collectionName: string,
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options: Record<string, unknown> = {}
): Promise<unknown> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(filter, update, options);
    console.log(`✏️ ${result.modifiedCount} document(s) updated`);
    return result;
}

export async function deleteDocument(
    collectionName: string,
    filter: Record<string, unknown>
): Promise<unknown> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(filter);
    console.log(`🗑️ ${result.deletedCount} document(s) deleted`);
    return result;
}

// ========================================
// UTILITY OPERATIONS
// ========================================
export async function countDocuments(
    collectionName: string,
    filter: Record<string, unknown> = {}
): Promise<number> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    return await collection.countDocuments(filter);
}

import type { IndexSpecification } from 'mongodb';

export async function createIndex(
    collectionName: string,
    indexSpec: IndexSpecification,
    options?: CreateIndexesOptions
): Promise<string> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.createIndex(indexSpec, options);
    console.log(`🔍 Index created: ${result}`);
    return result;
}

export async function listIndexes(collectionName: string): Promise<unknown[]> {
    const db = await getDatabase();
    const collection = db.collection(collectionName);
    return await collection.listIndexes().toArray();
}

export async function getCollectionStats(collectionName: string): Promise<unknown> {
    const db = await getDatabase();
    return await db.stats();
}