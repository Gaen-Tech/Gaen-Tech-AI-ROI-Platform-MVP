import React from 'react';
import { FileTextIcon, AlertCircleIcon, CheckCircleIcon } from './icons/Icon';
import { View } from '../types';

interface TermsOfServiceProps {
  setView: (view: View) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ setView }) => {
  const lastUpdated = "October 13, 2025";

  return (
    <div className="bg-slate-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileTextIcon className="w-16 h-16 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircleIcon className="w-6 h-6 text-cyan-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Important Notice</h3>
              <p className="text-gray-300">
                By using Gaen Technologies' AI ROI Platform, you agree to these terms. 
                Please read them carefully. If you don't agree, please don't use our service.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-8 space-y-8">
          
          {/* Section 1: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              Welcome to Gaen Technologies ("Gaen," "we," "us," or "our"). By accessing or using 
              our AI-powered sales intelligence platform (the "Service"), you agree to be bound by 
              these Terms of Service ("Terms").
            </p>
            <p className="text-gray-300">
              These Terms constitute a legally binding agreement between you (either an individual or entity) 
              and Gaen Technologies. If you are using the Service on behalf of an organization, you represent 
              and warrant that you have the authority to bind that organization to these Terms.
            </p>
          </section>

          {/* Section 2: Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              Gaen Technologies provides an AI-powered platform that:
            </p>
            <ul className="space-y-2 text-gray-300 ml-6">
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Analyzes public company websites and digital presence</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Identifies business opportunities and potential ROI</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Generates customized sales proposals</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Manages and qualifies sales leads</span>
              </li>
            </ul>
            <p className="text-gray-300 mt-4">
              The Service operates primarily as a client-side application, processing data in your browser 
              using Google's Gemini AI API.
            </p>
          </section>

          {/* Section 3: User Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Requirements</h2>
            <p className="text-gray-300 mb-4">To use our Service, you must:</p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc">
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Have a valid Google Gemini API key (you are responsible for obtaining this)</li>
            </ul>
          </section>

          {/* Section 4: Google Gemini API */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Google Gemini API Usage</h2>
            <p className="text-gray-300 mb-4">
              <strong>Important:</strong> Our Service uses Google's Gemini AI API. By using Gaen Technologies:
            </p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc">
              <li>You acknowledge that data is processed by Google's Gemini API</li>
              <li>You are responsible for your own Google Gemini API key and usage costs</li>
              <li>You agree to comply with Google's Gemini API Terms of Service</li>
              <li>You understand that Google's data handling policies apply to API requests</li>
            </ul>
            <p className="text-gray-300 mt-4">
              <strong>Data Processing Disclosure:</strong> When you analyze a company website, that URL 
              and related context are sent to Google's Gemini API for processing. According to Google's 
              terms, this data is not used to train general AI models.
            </p>
            <a 
              href="https://ai.google.dev/gemini-api/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-block mt-2"
            >
              View Google Gemini API Terms →
            </a>
          </section>

          {/* Section 5: User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Responsibilities</h2>
            <p className="text-gray-300 mb-4">You agree NOT to:</p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use the Service to scrape or harvest data from third-party websites without permission</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit viruses, malware, or other malicious code</li>
              <li>Use the Service to generate spam or unsolicited communications</li>
            </ul>
          </section>

          {/* Section 6: Data Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Handling</h2>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-white mb-2">Our Privacy Commitment:</h3>
              <ul className="space-y-2 text-gray-300 ml-6 list-disc">
                <li><strong>Client-Side Processing:</strong> Analysis happens in your browser</li>
                <li><strong>No Server Storage:</strong> We don't store your lead analyses on our servers</li>
                <li><strong>No AI Training:</strong> Your data is not used to train AI models</li>
                <li><strong>Local Storage:</strong> Data is stored locally in your browser</li>
              </ul>
            </div>
            <p className="text-gray-300">
              For detailed information about how we handle data, please review our 
              <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy'); }} className="text-cyan-400 hover:text-cyan-300 font-medium ml-1">
                Privacy Policy
              </a>.
            </p>
          </section>

          {/* Section 7: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>
            <p className="text-gray-300 mb-4">
              <strong>Our Property:</strong> The Service, including all software, designs, text, graphics, 
              and other content, is owned by Gaen Technologies and protected by copyright, trademark, 
              and other intellectual property laws.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Your Content:</strong> You retain all rights to the content you input into the Service. 
              The proposals, analyses, and reports generated remain your property.
            </p>
            <p className="text-gray-300">
              <strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable 
              license to access and use the Service for your business purposes, subject to these Terms.
            </p>
          </section>

          {/* Section 8: AI-Generated Content */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. AI-Generated Content Disclaimer</h2>
            <div className="bg-orange-500/10 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <p className="text-gray-300 mb-3">
                <strong>Important:</strong> Our Service uses AI to generate analysis and proposals. 
                You acknowledge and agree that:
              </p>
              <ul className="space-y-2 text-gray-300 ml-6 list-disc">
                <li>AI-generated content may contain errors or inaccuracies</li>
                <li>You are responsible for reviewing and verifying all generated content</li>
                <li>ROI estimates are projections, not guarantees</li>
                <li>We are not liable for decisions made based on AI-generated insights</li>
                <li>You should conduct your own due diligence before using any proposals</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations</h2>
            <p className="text-gray-300 mb-4">
              <strong>AS-IS Service:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT 
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES 
              OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>No Guarantee of Results:</strong> We do not guarantee that the Service will:
            </p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc">
              <li>Meet your specific requirements or expectations</li>
              <li>Be uninterrupted, timely, secure, or error-free</li>
              <li>Produce accurate, complete, or reliable results</li>
              <li>Lead to specific business outcomes or ROI</li>
            </ul>
          </section>

          {/* Section 10: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, GAEN TECHNOLOGIES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from use or inability to use the Service</li>
              <li>Any errors in AI-generated content or analysis</li>
            </ul>
            <p className="text-gray-300 mt-4">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID FOR THE SERVICE 
              IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* Section 11: Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify, defend, and hold harmless Gaen Technologies, its officers, 
              directors, employees, and agents from any claims, losses, damages, liabilities, and 
              expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="space-y-2 text-gray-300 ml-6 list-disc mt-3">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your violation of applicable laws or regulations</li>
            </ul>
          </section>

          {/* Section 12: Payment and Billing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Payment Terms</h2>
            <p className="text-gray-300 mb-4">
              <strong>Pricing:</strong> Current pricing information is available on our website. 
              Prices are subject to change with 30 days' notice.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Google API Costs:</strong> You are responsible for all costs associated with 
              your Google Gemini API usage. We are not responsible for these costs.
            </p>
            <p className="text-gray-300">
              <strong>Refunds:</strong> All sales are final. We do not offer refunds except as 
              required by law or at our sole discretion.
            </p>
          </section>

          {/* Section 13: Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Termination</h2>
            <p className="text-gray-300 mb-4">
              <strong>By You:</strong> You may stop using the Service at any time. You can delete 
              all locally stored data by clearing your browser storage.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>By Us:</strong> We reserve the right to suspend or terminate your access to 
              the Service at any time, with or without cause or notice, if we believe you have 
              violated these Terms.
            </p>
            <p className="text-gray-300">
              <strong>Effect of Termination:</strong> Upon termination, your right to use the Service 
              will immediately cease. Provisions that should survive termination (including disclaimers, 
              limitations of liability, and indemnification) will remain in effect.
            </p>
          </section>

          {/* Section 14: Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to These Terms</h2>
            <p className="text-gray-300">
              We may modify these Terms at any time. We will notify you of material changes by 
              posting the updated Terms on our website and updating the "Last Updated" date. 
              Your continued use of the Service after changes are posted constitutes your acceptance 
              of the revised Terms.
            </p>
          </section>

          {/* Section 15: Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law and Disputes</h2>
            <p className="text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the 
              State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-300">
              Any disputes arising from these Terms or the Service shall be resolved through 
              binding arbitration in accordance with the American Arbitration Association rules, 
              except that either party may seek injunctive relief in court for breaches of 
              intellectual property rights.
            </p>
          </section>

          {/* Section 16: General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">16. General Provisions</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, 
                constitute the entire agreement between you and Gaen Technologies.
              </p>
              <p>
                <strong>Severability:</strong> If any provision is found to be unenforceable, 
                the remaining provisions will remain in full effect.
              </p>
              <p>
                <strong>No Waiver:</strong> Our failure to enforce any right or provision shall 
                not constitute a waiver of that right or provision.
              </p>
              <p>
                <strong>Assignment:</strong> You may not assign these Terms without our prior 
                written consent. We may assign these Terms without restriction.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-slate-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-900/50 rounded-lg p-6">
              <p className="text-gray-300 mb-2">
                <strong>Gaen Technologies</strong>
              </p>
              <p className="text-gray-300 mb-2">
                Email: <a href="mailto:legal@gaentechnologies.com" className="text-cyan-400 hover:text-cyan-300">
                  legal@gaentechnologies.com
                </a>
              </p>
              <p className="text-gray-300">
                Website: <a href="https://www.gaentechnologies.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  www.gaentechnologies.com
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Acknowledgment Box */}
        <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">
                By using Gaen Technologies, you acknowledge that:
              </h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• You have read and understood these Terms of Service</li>
                <li>• You agree to be bound by these Terms</li>
                <li>• You understand the role of Google Gemini API in our Service</li>
                <li>• You are responsible for verifying AI-generated content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
