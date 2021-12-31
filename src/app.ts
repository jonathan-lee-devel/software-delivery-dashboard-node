import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connect } from "mongoose";
import { UsersRouter } from "./routes/users";

dotenv.config();

const app = express();
app.use(helmet.hidePoweredBy());
app.use(logger("dev"));
const corsOptions = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connect("mongodb://localhost:27017/test")
  .then((_) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

app.use("/users", UsersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(
  (
    err: { message: any; status: any },
    req: { app: { get: (arg0: string) => string } },
    res: {
      locals: { message: any; error: any };
      status: (arg0: any) => void;
      json: (arg0: { error: any }) => void;
    },
    _: any
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({ error: err });
  }
);

export { app };
