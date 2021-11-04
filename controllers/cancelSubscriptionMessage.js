

const cancelSubscriptionMessage = async (req, res) => {
    
    try {

        return res.status (200).send ({
            status: 'failure',
            message: 'subscription cancelled'
        })

    } catch (error) {
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    }

}

module.exports = {
    cancelSubscriptionMessage
}