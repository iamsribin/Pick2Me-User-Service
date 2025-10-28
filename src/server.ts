import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startGrpcServer } from "./grpc/server";
import { connectSQL } from "./config/sql-database";
import { isEnvDefined } from "./utils/envChecker";

// server
const startServer = async () => {
    try {
        // check all env are defined
        isEnvDefined();

        // connect to db
        connectSQL();

        // start grpc server
        startGrpcServer()

        //listen to port
        app.listen(process.env.PORT, () =>
            console.log(`User service running on port ${process.env.PORT}`)
        );
    } catch (err: any) {
        console.log(err.message);
    }
};

startServer();