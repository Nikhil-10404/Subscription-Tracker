import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";

const SubscriptionRouter=Router();

SubscriptionRouter.get('/', (req,res)=> res.send({title:"GET all Subscription"}));
SubscriptionRouter.get('/:id', (req,res)=> res.send({title:"GET Subscription detail"}));
SubscriptionRouter.post('/', authorize, createSubscription);
SubscriptionRouter.put('/:id', (req,res)=> res.send({title:"Update Subscription"}));
SubscriptionRouter.delete('/:id', (req,res)=> res.send({title:"Delete Subscription"}));
SubscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
SubscriptionRouter.put('/:id/cancel', (req,res)=> res.send({title:"Cancel Subscription"}));
SubscriptionRouter.get('/upcoming renewls', (req,res)=> res.send({title:"GET upcoming renewls"}));

export default SubscriptionRouter;