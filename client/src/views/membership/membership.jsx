import React from 'react'
import PricingPlans from '../../components/membershipCard.jsx'
import Footer from '../../components/Footer.jsx'
import Navbar from '../../components/Navbar.jsx'
function membership() {
    return (
        <div>
            <Navbar />
            <PricingPlans />
            <Footer />
        </div>
    )
}

export default membership