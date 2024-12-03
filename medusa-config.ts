import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "./src/modules/file-google-cloud-storage",
            id: "file-google-cloud-storage",
            options: {
              credentials: {
                client_email: process.env.SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.PRIVATE_KEY,
              },
              privateBucketName: process.env.GCP_STORAGE_BUCKET,
              // bucket: process.env.GCP_STORAGE_BUCKET,
              // project_id: process.env.GCP_PROJECT_ID,
              publicBucketName: process.env.GCP_STORAGE_BUCKET,
              basePublicUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/`,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/gift-cards",
    },
  ],
});
