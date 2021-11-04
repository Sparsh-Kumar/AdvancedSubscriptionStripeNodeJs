

$(document).ready (function () {
    
    const redirect = (url = '') => {
        if (url) {
            window.location.href = url
        }
    }

    $('#basicPlanButton').on ('click', function () {
        redirect (`subscribe-to-plan?plan=basic`);
    })

    $('#proPlanButton').on ('click', function () {
        redirect (`subscribe-to-plan?plan=pro`);
    })

    $('#manageSubscription').on ('click', function () {
        redirect (`manage-subscription`);
    })

})