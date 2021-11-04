

const Stripe = require ('stripe');
const stripe = Stripe (process.env.STRIPE_SECRET_API_KEY);


const addNewCustomer = async (email = '') => {

    try {

        if (!email) {
            throw new Error ('Email is not provided');
        }

        return await stripe.customers.create ({
            email,
            description: `New Customer added on ${new Date ().toString ()}`
        });

    } catch (error) {

        return new Promise ((resolve, reject) => {
            reject (error);
        })

    }

}


const getCustomerByID = async (id) => {
    
    try {

        return await stripe.customers.retrieve (id);

    } catch (error) {

        return new Promise ((resolve, reject) => {
            reject (error);
        })

    }

}

const createCheckoutSession = async (customerID, price) => {

    try {

        if (!customerID || !price) {
            throw new Error ('Both customerID and price are important');
        }
        
        const session = await stripe.checkout.sessions.create ({
            
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customerID,
            line_items: [
                {
                    price,
                    quantity: 1
                }
            ],
            subscription_data: {
                trial_period_days: 2
            },

            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL

        });

        return session;

    } catch (error) {

        return new Promise ((resolve, reject) => {
            reject (error);
        })

    }

}


const createWebhookEvent = async (rawBody, sig) => {
    
    try {

        const event = stripe.webhooks.constructEvent (
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )

        return event;

    } catch (error) {
        return new Promise ((resolve, reject) => {
            reject (error);
        })
    }

}

const createBillingSession = async (customerId) => {

    try {

        const session = await stripe.billingPortal.sessions.create ({
            customer: customerId,
            return_url: 'http://localhost:3000'
        });

        return session;

    } catch (error) {
        return new Promise ((resolve, reject) => {
            reject (error);
        })
    }

}

module.exports = {
    addNewCustomer,
    getCustomerByID,
    createCheckoutSession,
    createWebhookEvent,
    createBillingSession
}