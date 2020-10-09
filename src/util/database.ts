import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

const db = <string>process.env.DB_CONNECTION;
const user = <string>process.env.DB_USER;
const pass = <string>process.env.DB_PASS;

mongoose.connect(
    db,
    {
        user,
        pass,
        useNewUrlParser: true,
    },
    (err: any) => {
        if (err) {
            console.error("Could not connect to MongoDB");
        } else {
            console.info("MongoDB up and running");
        }
    }
);
