

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));


const showSubscriptionPage = async (req, res) => {

    try {

        /** if he is logged in */
        /** and has subscribed to a plan, then we will show the Manage Subscription button to user */

        const isLoggedIn = req.oidc.user ? true: false;
        let shouldManageSubscription = false;

        if (isLoggedIn) {
            const user = await User.findOne ({ email: req.oidc.user.email }).populate ('subscribedPlan');
            shouldManageSubscription = user && user.subscribedPlan ? true: false;
        }

        return res.status (200).render ('layouts/subscribe', {
            shouldManageSubscription
        });

    } catch (error) {
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    }

}


module.exports = {
    showSubscriptionPage
}