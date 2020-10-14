import mongoose from "mongoose";
import { DB_CONNECTION, DB_USER, DB_PASS } from "../constants";

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

const db = DB_CONNECTION;
const user = DB_USER;
const pass = DB_PASS;

mongoose.connect(
    db,
    {
        user,
        pass,
        useNewUrlParser: true,
    },
    (error: any) => {
        if (error) {
            console.error("Could not connect to MongoDB", error);
        } else {
            console.info("MongoDB up and running");
        }
    }
);
