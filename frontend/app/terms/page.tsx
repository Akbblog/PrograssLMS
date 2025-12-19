import React from 'react';

export const metadata = {
    title: 'Terms of Service | ProgressLMS',
    description: 'Terms of Service for ProgressLMS',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-slate-800 dark:text-slate-100">Terms of Service</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">1. Agreement to Terms</h2>
                    <p className="mb-4">
                        By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">2. Educational Services</h2>
                    <p className="mb-4">
                        ProgressLMS provides a learning management system for schools, teachers, and students. We reserve the right to withdraw or amend our service, and any service or material we provide, in our sole discretion without notice.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">3. User Accounts</h2>
                    <p className="mb-4">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className="mb-4">
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">4. Intellectual Property</h2>
                    <p className="mb-4">
                        The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of ProgressLMS and its licensors.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">5. Termination</h2>
                    <p className="mb-4">
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">6. Limitation of Liability</h2>
                    <p className="mb-4">
                        In no event shall ProgressLMS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>
            </div>
        </div>
    );
}
