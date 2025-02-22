import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AuctionHub</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-12">
        <p className="text-lg text-gray-700 mb-6">
          Experience the thrill of online auctions with AuctionHub - where every bid brings you closer to your desired items. Our platform provides a secure and transparent environment for buyers and sellers to connect and trade.
        </p>
        <div className="space-x-4">
          <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Get Started
          </Link>
          <Link to="/signin" className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Easy Bidding</h3>
          <p className="text-gray-600">Place bids with just a few clicks and track your auctions in real-time.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
          <p className="text-gray-600">Your transactions are protected with industry-standard security measures.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Fair Trading</h3>
          <p className="text-gray-600">Our transparent bidding system ensures fair competition for all users.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;