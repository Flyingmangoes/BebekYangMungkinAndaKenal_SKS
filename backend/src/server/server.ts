// src/server.ts
import "temporal-polyfill/full/global";
import "dotenv/config";
import { createApp } from "../app";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

const server = app.listen(port, () => console.log(`API listening on :${port}`));

process.on("SIGTERM", () => server.close(() => process.exit(0)));