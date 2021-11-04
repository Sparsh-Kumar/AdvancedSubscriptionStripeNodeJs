

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { createBillingSession } = require (path.resolve (__dirname, '..', 'stripeHelpers', 'stripeHelpers'));

const manageSubscription = async (req, res) => {

    try {

        const user = await User.findOne ({ email: req.oidc.user.email }).lean ();
        if (!user) {
            throw new Error ('No user is registered with that email account');
        }

        if (!user.subscribedPlan) {
            throw new Error ('The user is not subscribed to a plan');
        }
        
        const session = await createBillingSession (user.customerId);
        return res.redirect (session.url);

    } catch (error) {

        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })

    }

}

module.exports = {
    manageSubscription
}