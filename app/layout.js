import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
    title: 'Tacto - AI-Powered Supply Chain Management',
    description: 'Streamline your supply chain with AI-powered insights',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-y-auto p-4">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
