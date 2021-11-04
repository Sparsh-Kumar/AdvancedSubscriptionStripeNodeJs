

const RouteHandler = require ('express').Router ();
const path = require ('path');
const { requiresAuth } = require ('express-openid-connect');

const { showSubscriptionPage } = require (path.resolve (__dirname, '..', 'controllers', 'showSubscriptionPage'));
const { subscribeToPlan } = require (path.resolve (__dirname, '..', 'controllers', 'subscribeToPlan'));
const { manageSubscription } = require (path.resolve (__dirname, '..', 'controllers', 'manageSubscription'));
const { successSubscriptionMessage } = require (path.resolve (__dirname, '..', 'controllers', 'successSubscriptionMessage'));
const { cancelSubscriptionMessage } = require (path.resolve (__dirname, '..', 'controllers', 'cancelSubscriptionMessage'));
const { handleStripeWebhooks } = require (path.resolve (__dirname, '..', 'controllers', 'handleStripeWebhooks'));

RouteHandler.get ('/', showSubscriptionPage);
RouteHandler.get ('/subscribe-to-plan', requiresAuth (), subscribeToPlan);
RouteHandler.get ('/manage-subscription', requiresAuth (), manageSubscription);
RouteHandler.get ('/success-subscription', requiresAuth (), successSubscriptionMessage);
RouteHandler.get ('/cancel-subscription', requiresAuth (), cancelSubscriptionMessage);
RouteHandler.post ('/webhook', handleStripeWebhooks);

module.exports = {
    RouteHandler
}