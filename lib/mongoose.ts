import mongoose, { ConnectionStates } from "mongoose";

class MongoDBSingleton {
  private static instance: MongoDBSingleton | null = null;
  private connection: typeof mongoose | null = null;
  private poolSize = 10;

  private constructor() {
    mongoose.connection.on("open", () => {
      console.log(`[MONGOOSE] Connected with poolSize ${this.poolSize}`);
    });
  }

  public static getInstance(): MongoDBSingleton {
    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = new MongoDBSingleton();
    }
    return MongoDBSingleton.instance;
  }

  public async connect(): Promise<void> {
    if (
      this.connection === null ||
      (this.connection.connection.readyState !== ConnectionStates.connected &&
        this.connection.connection.readyState !== ConnectionStates.connecting)
    ) {
      console.log("[MONGOOSE] Creating New Connection");
      if (!process.env.MONGODB_URL) {
        console.error("Missing MongoDB URL");
        return;
      }

      try {
        await mongoose.connect(process.env.MONGODB_URL, {});
        mongoose.set("bufferTimeoutMS", 2500);
        this.connection = mongoose;
        console.log("[MONGOOSE] Connection established");
      } catch (err) {
        console.error("[MONGOOSE] Connection error:", err);
        throw err;
      }
    } else {
      console.log("[MONGOOSE] Reusing existing connection");
    }
  }
}

export const connectToDB = async (): Promise<void> => {
  const db = MongoDBSingleton.getInstance();
  await db.connect();
};
