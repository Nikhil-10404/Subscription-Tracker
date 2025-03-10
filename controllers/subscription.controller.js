import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js';
import { QSTASH_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
  try {
    console.log("🟢 Received request to create subscription:", req.body);
    
    if (!req.user || !req.user._id) {
      throw new Error("❌ User ID is missing in request.");
    }

    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    console.log("✅ Subscription created:", subscription);

    const { workflowRunId } = await workflowClient.trigger({
      url: `${QSTASH_URL}/v1/publish/api/v1/workflows/subscription/reminder`,
      body: { subscriptionId: subscription._id },
      headers: { 'content-type': 'application/json' },
      retries: 0,
    });

    console.log("✅ Workflow triggered:", workflowRunId);

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    console.error("❌ Error creating subscription:", e);
    res.status(500).json({ success: false, error: e.message });
  }
};





      export const getUserSubscriptions = async (req, res, next) => {
        try {
          // Check if the user is the same as the one in the token
          if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
          }
      
          const subscriptions = await Subscription.find({ user: req.params.id });
      
          res.status(200).json({ success: true, data: subscriptions });
        } catch (e) {
          next(e);
        }
      }