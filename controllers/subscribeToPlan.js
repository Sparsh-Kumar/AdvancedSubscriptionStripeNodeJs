
/**
 * https://saasbase.dev/tag/guides/
 * https://saasbase.dev/subscription-payments-1-adding-basic-and-pro-subscription-plans-using-stripe/
 */


const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { addNewCustomer,  createCheckoutSession } = require (path.resolve (__dirname, '..', 'stripeHelpers', 'stripeHelpers'));

const subscribeToPlan = async (req, res) => {

    try {

        const plan = req.query.plan;

        /** checking if any plan exists */
        if (!plan) {
            throw new Error ('please provide the plan as a query parameter to the request that you want to subscribe');
        }
        
        const plans = {
            'basic': process.env.BASIC_PLAN_PRICING_ID,
            'pro': process.env.ADVANCED_PLAN_PRICING_ID
        }
        
        /** getting the price ID */
        if (!plans [plan]) {
            throw new Error ('This plan is not supported');
        }
        
        /** getting the price ID if plan is supported */
        let priceID = plans [plan];

        /** creating the user if not exists */
        let userData = await User.findOne ({ email: req.oidc.user.email }).lean ();

        if (!userData) {
            
            /** creating the stripe customer */
            const createdCustomer = await addNewCustomer (req.oidc.user.email);

            /** create the user in mongodb database */
            userData = await User.create ({
            
                customerId: createdCustomer.id,
                nickname: req.oidc.user.nickname,
                name: req.oidc.user.name,
                picture: req.oidc.user.picture,
                email: req.oidc.user.email,
                email_verified: req.oidc.user.email_verified,
                sub: req.oidc.user.sub
            
            });

        }

        /** creating the session id for transaction */
        const session = await createCheckoutSession (userData.customerId, priceID);

        /** redirecting to the checkoutURL */
        return res.redirect (session.url);

    } catch (error) {

        /** throwing the error if occurs */
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })

    }

}

module.exports = {
    subscribeToPlan
}