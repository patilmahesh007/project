import React from 'react'
import MembershipPurchase from '../../components/membershipCard.jsx'
import Footer from '../../components/Footer.jsx'
import Navbar from '../../components/Navbar.jsx'
function membership() {
    return (
        <div>
            <Navbar />
            <MembershipPurchase />
            <Footer />
        </div>
    )
}

export default membership