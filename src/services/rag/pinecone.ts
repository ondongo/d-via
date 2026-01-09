import { Pinecone } from '@pinecone-database/pinecone';
const {
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
} = process.env;
/************************************************************************************
 * Pinecone (Sert à stocker les vecteurs mathématiques dans une bd spécialisée)
 ************************************************************************************/
export const pinecone = PINECONE_API_KEY ? new Pinecone({
    apiKey: PINECONE_API_KEY,
}) : null;

export const pineconeIndex = pinecone && PINECONE_INDEX_NAME ? pinecone.Index(PINECONE_INDEX_NAME) : null;

