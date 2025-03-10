import express from "express";
// import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import SubscriptionRouter from "./routes/Subscription.routes.js";
import connectToDatabase from "./databse/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', SubscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);
app.use(errorMiddleware);




app.get('/', (req, res) => {
    res.send("Welcome to the subscription tracker");
});



const PORT = process.env.PORT || 3000; // Use PORT from environment
app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT}`);
  await  connectToDatabase();
});

export default app;
