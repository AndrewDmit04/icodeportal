// lib/mongoose.ts
import mongoose, { ConnectionStates } from "mongoose";

declare global {
  var mongooseInstance: MongoDBSingleton | undefined;
}

class MongoDBSingleton {
  private static instance: MongoDBSingleton;
  private connection: typeof mongoose | null = null;
  private readonly poolSize = 10;
  private isConnecting = false;

  private constructor() {
    // Initialize connection event listeners
    mongoose.connection.on("connected", () => {
      console.log(`[MONGOOSE] Connected with poolSize ${this.poolSize}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("[MONGOOSE] Connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("[MONGOOSE] Disconnected");
    });

    // Handle process termination
    process.on("beforeExit", () => {
      this.closeConnection();
    });
  }

  public static getInstance(): MongoDBSingleton {
    if (process.env.NODE_ENV === "development") {
      if (!global.mongooseInstance) {
        global.mongooseInstance = new MongoDBSingleton();
      }
      return global.mongooseInstance;
    }

    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = new MongoDBSingleton();
    }
    return MongoDBSingleton.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    // If already connected, return existing connection
    if (
      this.connection?.connection?.readyState === ConnectionStates.connected
    ) {
      return this.connection;
    }

    // If connecting, wait for connection
    if (this.isConnecting) {
      console.log("[MONGOOSE] Connection in progress, waiting...");
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.connection?.connection?.readyState === ConnectionStates.connected) {
            clearInterval(checkConnection);
            resolve(this.connection);
          }
        }, 100);
      });
    }

    this.isConnecting = true;

    try {
      if (!process.env.MONGODB_URL) {
        throw new Error("Missing MONGODB_URL in environment variables");
      }

      console.log("[MONGOOSE] Creating new connection");
      
      this.connection = await mongoose.connect(process.env.MONGODB_URL, {
        maxPoolSize: this.poolSize,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      });

      mongoose.set("bufferTimeoutMS", 2500);
      this.isConnecting = false;
      
      return this.connection;
    } catch (err) {
      this.isConnecting = false;
      console.error("[MONGOOSE] Connection error:", err);
      throw err;
    }
  }

  public async closeConnection(): Promise<void> {
    if (this.connection) {
      try {
        await mongoose.disconnect();
        console.log("[MONGOOSE] Connection closed");
      } catch (err) {
        console.error("[MONGOOSE] Error closing connection:", err);
      }
    }
  }
}

// Utility function for connecting to database
export  const connectToDB = async (): Promise<typeof mongoose> => {
  const db = MongoDBSingleton.getInstance();
  return await db.connect();
};

export  default connectToDB ;