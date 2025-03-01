import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <h1>Welcome to AuctionHub</h1>
        <p>
          Discover the excitement of online auctions. Bid on unique items, sell your treasures, and join a vibrant community of buyers and sellers.
        </p>
        <div className="buttons">
          <Link to="/signup" className="signup">Sign Up Now</Link>
          <Link to="/signin" className="signin">Sign In</Link>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <h3>Easy Bidding</h3>
          <p>Place bids effortlessly and track auctions in real-time.</p>
        </div>
        <div className="feature">
          <h3>Secure Transactions</h3>
          <p>Your payments and data are protected with top-notch security.</p>
        </div>
        <div className="feature">
          <h3>Fair Marketplace</h3>
          <p>Transparent rules ensure a level playing field for all.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;