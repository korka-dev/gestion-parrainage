import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL est manquant dans le fichier .env");
}

const conn = mongoose.createConnection(databaseUrl);

let gfs: mongoose.mongo.GridFSBucket | null = null;

conn.once("open", () => {
  if (conn.db) {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  } else {
    console.error("Impossible d'initialiser GridFSBucket : la base de données est indéfinie.");
  }
});

const storage = new GridFsStorage({
  url: databaseUrl,
  file: (req, file) => {
    return { filename: file.originalname, bucketName: "uploads" };
  },
});

const upload = multer({ storage });

export { gfs, upload };
