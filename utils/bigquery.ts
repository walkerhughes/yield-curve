// utils/bigquery.ts

import { BigQuery } from '@google-cloud/bigquery';

export function createBigQueryClient() {
    // Retrieve environment variables and handle private key format
    const type = process.env.BIGQUERY_TYPE;
    const projectId = process.env.BIGQUERY_PROJECT_ID;
    const privateKeyId = process.env.BIGQUERY_PRIVATE_KEY_ID;
    const privateKey = process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines properly
    const clientEmail = process.env.BIGQUERY_CLIENT_EMAIL;
    const clientId = process.env.BIGQUERY_CLIENT_ID;
    const authUri = process.env.BIGQUERY_AUTH_URI;
    const tokenUri = process.env.BIGQUERY_TOKEN_URI;
    const authProviderX509CertUrl = process.env.BIGQUERY_AUTH_PROVIDER_X509_CERT_URL;
    const clientX509CertUrl = process.env.BIGQUERY_CLIENT_X509_CERT_URL;
    const universeDomain = process.env.BIGQUERY_UNIVERSE_DOMAIN;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Missing required BigQuery credentials in environment variables");
    }

    // Create the credentials object using the environment variables
    const credentials = {
        type: type,
        project_id: projectId,
        private_key_id: privateKeyId,
        private_key: privateKey,
        client_email: clientEmail,
        client_id: clientId,
        auth_uri: authUri,
        token_uri: tokenUri,
        auth_provider_x509_cert_url: authProviderX509CertUrl,
        client_x509_cert_url: clientX509CertUrl,
        universe_domain: universeDomain
    };

    // Initialize the BigQuery client with the constructed credentials
    const bigQueryClient = new BigQuery({
        projectId: projectId,
        credentials: credentials
    });

    return bigQueryClient;
}

