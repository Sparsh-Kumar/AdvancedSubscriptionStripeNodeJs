

const { dangerouslyDisableDefaultSrc } = require('helmet/dist/middlewares/content-security-policy');
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Plan } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Plan'));
const { createWebhookEvent } = require  (path.resolve (__dirname, '..', 'stripeHelpers', 'stripeHelpers'));

const handleStripeWebhooks = async (req, res) => {

    try {

        let event = await createWebhookEvent (req.body, req.header ('Stripe-Signature'));
        const data = event.data.object;

        /** handle the subscription created event here and then update the user's plan in MongoDB database */

        switch (event.type) {

            /** webhook event for creation of a new subscription */

            case 'customer.subscription.created':

                let user = await User.findOne ({ customerId: data.customer }).lean ();
                let plan = await Plan.create ({
                    
                    userId: user._id,
                    planId: data.plan.product,
                    pricingId: data.plan.id,
                    planType: data.plan.product === process.env.BASIC_PLAN_ID ? 'basic': data.plan.product === process.env.ADVANCED_PLAN_ID ? 'advanced': '',
                    trialStartDate: new Date (data.trial_start * 1000),
                    trialEndDate: new Date (data.trial_end * 1000)

                });
                

                const updatedUser = await User.findOneAndUpdate ({
                    _id: user._id
                }, {
                    $set: {
                        subscribedPlan: plan._id
                    }
                }, { new: true, upsert: true, runValidators: true, context: 'query' });


                break;

            /** add the webhooks for subscription cancelled and subscription updated webhook events */

            case 'customer.subscription.updated':
            
                const userDetails = await User.findOne ({ customerId: data.customer }).populate ('subscribedPlan');
                const { subscribedPlan } = userDetails;
                const updateObject = {};

                if (data.plan.product === process.env.BASIC_PLAN_ID) {
                    updateObject ['planId'] = process.env.BASIC_PLAN_ID,
                    updateObject ['pricingId'] = process.env.BASIC_PLAN_PRICING_ID,
                    updateObject ['planType'] = 'basic'
                }

                if (data.plan.product === process.env.ADVANCED_PLAN_ID) {
                    updateObject ['planId'] = process.env.ADVANCED_PLAN_ID,
                    updateObject ['pricingId'] = process.env.ADVANCED_PLAN_PRICING_ID,
                    updateObject ['planType'] = 'advanced'
                }

                /** if the plan has canceled_at flag set, that means user has cancelled the plan,
                 * so adding the flag cancelled = true in plan
                 */

                if (data.canceled_at) {
                    updateObject ['cancelled'] = true;
                } else {
                    updateObject ['cancelled'] = false;
                }

                updateObject ['trialStartDate'] = new Date (data.trial_start * 1000);
                updateObject ['trialEndDate'] = new Date (data.trial_end * 1000);

                let updatedPlan = undefined;

                /** update the plan for that user */
                /** this may be null, as if user cancels the plan and try to renew it */

                if (subscribedPlan && subscribedPlan._id) {

                    updatedPlan = await Plan.findOneAndUpdate ({
                        _id: subscribedPlan._id
                    }, {
                        $set: updateObject
                    }, { new: true, upsert: true, runValidators: true, context: 'query' });

                } else {

                    updateObject ['userId'] = userDetails._id;
                    updatedPlan = await Plan.create (updateObject);

                }

                /** if cancelled the subscription then, remove the subscribed plan from the user document */
                /** otherwise update the user with the newly created plan */

                let updatedUserDoc = await User.findOneAndUpdate ({ _id: userDetails._id }, {
                    $set: {
                        subscribedPlan: data.canceled_at ? null: updatedPlan._id
                    }
                }, { new: true, upsert: true, runValidators: true, context: 'query' });

                break;

            default:
                break;

        }

        return res.sendStatus (200);

    } catch (error) {
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    }

}

module.exports = {
    handleStripeWebhooks
}