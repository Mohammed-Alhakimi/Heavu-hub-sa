import React from 'react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | 'about' | 'faq';
}

const LegalModals: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
    if (!isOpen) return null;

    const content = {
        about: {
            title: 'About Heavy Hub',
            sections: [
                {
                    heading: 'Our Vision',
                    text: 'Heavy Hub is Saudi Arabia\'s premier digital marketplace for heavy equipment. Our vision is to modernize the Kingdom\'s construction and industrial sectors by providing a transparent, efficient, and secure platform for equipment rental and sales.'
                },
                {
                    heading: 'Why Heavy Hub?',
                    text: 'We bridge the gap between equipment owners and contractors. By leveraging technology, we reduce idle time for machinery owners and provide renters with a massive, verified fleet at their fingertips, anywhere in the Kingdom.'
                },
                {
                    heading: 'KSA Focused',
                    text: 'Headquartered in Riyadh, we are built specifically for the Saudi market. We align with Vision 2030 by promoting digital transformation and supporting the local construction ecosystem with local expertise and support.'
                }
            ]
        },
        faq: {
            title: 'Frequently Asked Questions',
            sections: [
                {
                    heading: 'How do I list my equipment?',
                    text: 'Click on the "+ List Item" button in the header. You\'ll need to provide machine details, photos, and your desired rental/sale rates. Our team reviews all listings within 24-48 hours to ensure quality and authenticity.'
                },
                {
                    heading: 'Is my payment secure?',
                    text: 'Yes, we use Saudi-regulated payment gateways. For rentals, we hold the funds in escrow and only release them to the owner once the equipment is successfully delivered and confirmed on-site.'
                },
                {
                    heading: 'What if the machine breaks down during rental?',
                    text: 'Our terms require owners to provide "ready-to-work" machinery. If a breakdown occurs due to mechanical failure, the owner is responsible for repair or replacement. Our support team is available to mediate any disputes.'
                },
                {
                    heading: 'Do you provide insurance?',
                    text: 'While we provide a secure platform and digital contracts, we recommend that both owners and renters maintain their own comprehensive equipment and liability insurance policies.'
                }
            ]
        },
        privacy: {
            title: 'Privacy Policy (Saudi PDPL Compliant)',
            sections: [
                {
                    heading: '1. Introduction',
                    text: 'This Privacy Policy explains how Heavy Hub ("we", "our", or "us") collects, uses, and protects your personal data. We are committed to processing your information in accordance with the Saudi Arabian Personal Data Protection Law (PDPL) and its Executive Regulations to ensure your privacy and the security of your data.'
                },
                {
                    heading: '2. Data Collection',
                    text: 'We collect information necessary to provide our marketplace services, including Identity Information (Full name, national ID/Iqama, commercial registration), Contact Information (Phone, email, location), Transaction Data (Payment details, rental history), and Technical Data (IP address, device type).'
                },
                {
                    heading: '3. Legal Basis for Processing',
                    text: 'In compliance with the PDPL, we process your data based on the Performance of a Contract, Legal Obligation (ZATCA, anti-money laundering), Consent (for marketing), and Legitimate Interest (fraud prevention).'
                },
                {
                    heading: '4. Data Sharing and Transfer',
                    text: 'Your contact details are shared with the counterparty only upon confirmed booking. We may share data with trusted service providers (e.g., Moyasar, cloud hosting). Cross-border transfers are conducted only with equivalent protection levels as mandated by the PDPL. We strictly do not sell your personal data.'
                },
                {
                    heading: '5. Your Data Rights (Under PDPL)',
                    text: 'As a data subject in KSA, you have the right to be informed, the right of access, the right to rectification, the right to destruction (erasure), and the right to withdraw consent at any time.'
                },
                {
                    heading: '6. Data Security and Retention',
                    text: 'We implement robust technical measures like encryption and firewalls. We retain your data only for as long as necessary to fulfill the platform purposes or to comply with Saudi Arabian record-keeping laws.'
                },
                {
                    heading: '7. Contact Us',
                    text: 'For any questions or to exercise your rights, contact our Data Protection Officer (DPO) at Email: hakimi@HeavyHub.com.sa | Address: Riyadh, Saudi Arabia.'
                }
            ]
        },
        terms: {
            title: 'Terms and Conditions',
            sections: [
                {
                    heading: '1. Rental Agreement',
                    text: 'Heavy Hub provides the digital infrastructure to connect Owners (Lesser) and Renters (Lessee). The platform does not own, inspect, or maintain the heavy machinery listed. Once a booking is confirmed, a binding legal contract is formed directly between the Owner and the Renter. Heavy Hub is not an agent, insurer, or representative for either party.'
                },
                {
                    heading: '2. Payment and VAT',
                    text: 'All transactions are processed in Saudi Riyals (SAR). In accordance with the VAT Law of the Kingdom of Saudi Arabia, a 15% VAT will be added to the rental fee and the platform service fee at checkout. Heavy Hub reserves the right to charge a platform fee for facilitating the transaction, which will be clearly displayed before you commit to the booking.'
                },
                {
                    heading: '3. Equipment Condition and Inspection',
                    text: 'Owners must ensure the machine is in "ready-to-work" condition and mechanically sound. Upon delivery or pickup, both parties are encouraged to sign a "Condition Report" or take timestamped photos/videos. Discrepancies (e.g., mechanical failure, body damage) must be reported to the Owner and Heavy Hub within 2–4 hours of delivery to be eligible for dispute support.'
                },
                {
                    heading: '4. Liability and Indemnification',
                    text: 'Heavy Hub is not responsible for property damage, bodily injury, or death resulting from the use or misuse of the equipment. The Renter is responsible for ensuring that the operator holds valid Saudi licenses and certifications for the specific equipment class. Users agree to indemnify and hold Heavy Hub harmless from any legal claims arising from their negligence or breach of agreement.'
                },
                {
                    heading: '5. Governing Law and Dispute Resolution',
                    text: 'These terms are governed by the laws of the Kingdom of Saudi Arabia. Parties agree to first attempt to resolve disputes through Heavy Hub’s internal mediation process. If mediation fails, the dispute shall be submitted to the exclusive jurisdiction of the competent courts in Riyadh. The Arabic version of these terms shall prevail in the event of a legal conflict.'
                }
            ]
        }
    };

    const selectedContent = content[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedContent.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-8 overflow-y-auto space-y-6">
                    {selectedContent.sections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{section.heading}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{section.text}</p>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModals;
