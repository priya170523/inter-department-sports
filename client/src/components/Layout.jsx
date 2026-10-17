import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-accent/20 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pt-4 md:pt-24 pb-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
