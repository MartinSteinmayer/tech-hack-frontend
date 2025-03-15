const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-3">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                        <p>&copy; {new Date().getFullYear()} Tacto Supply Chain Solutions. All rights reserved.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-900">Privacy</a>
                        <a href="#" className="hover:text-gray-900">Terms</a>
                        <a href="#" className="hover:text-gray-900">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
