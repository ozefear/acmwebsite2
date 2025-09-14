
import React, { useState } from 'react';
import Section from '../components/Section';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '../components/icons/SocialIcons';
import GlowPanel from '../components/GlowPanel';

const socialLinks = [
    { name: 'GitHub', href: '#', icon: GithubIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
    { name: 'LinkedIn', href: '#', icon: LinkedinIcon },
];

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setResponseMessage('');

        // Simulate API call
        try {
            // This is a placeholder. Replace with your actual API endpoint.
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            // Wait for 1.5s to show the sending state for better UX
            await new Promise(res => setTimeout(res, 1500));

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            
            setStatus('success');
            setResponseMessage('Your message has been sent successfully!');
            setFormData({ name: '', surname: '', email: '', phone: '', message: '' }); // Reset form
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
            setResponseMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <Section id="contact" title="[Get_In_Touch]">
            <div className="max-w-4xl mx-auto text-center space-y-20">
                {/* --- Direct Contact Info --- */}
                <div>
                    <p className="text-lg text-slate-400 mb-8">
                        Have questions, ideas, or want to collaborate? We'd love to hear from you. Reach out through our official channels.
                    </p>
                    <div className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg inline-block hover:border-purple-500/50 transition-colors">
                        <a href="mailto:contact@acmhacettepe.org" className="text-[clamp(1rem,4vw,1.5rem)] font-bold font-mono text-purple-400 glitch-hover break-all" data-text="contact@acmhacettepe.org">
                            contact@acmhacettepe.org
                        </a>
                    </div>
                    <div className="mt-12">
                        <h4 className="font-mono text-xl mb-6">Follow us on social media:</h4>
                        <div className="flex justify-center space-x-8">
                            {socialLinks.map((item) => (
                                <a key={item.name} href={item.href} className="text-slate-400 hover:text-purple-500 transform hover:scale-110 transition-transform duration-300">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-8 w-8" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Contact Form --- */}
                <div className="text-left">
                     <h3 className="text-[clamp(1.5rem,5vw,1.875rem)] font-bold font-mono text-center mb-12 glitch-hover" data-text="[Send_Us_A_Message]">
                        [Send_Us_A_Message]
                     </h3>
                    <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-mono text-purple-400 mb-2">Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-mono text-purple-400 mb-2">Surname</label>
                                    <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-mono text-purple-400 mb-2">Email</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-mono text-purple-400 mb-2">Phone <span className="text-slate-500">(Optional)</span></label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-mono text-purple-400 mb-2">Message</label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"></textarea>
                            </div>
                            
                            <div className="flex items-center justify-between gap-4">
                               <button 
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                    <span className="relative glitch-hover" data-text={status === 'sending' ? 'Sending...' : 'Send Message'}>
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </span>
                                </button>
                            </div>
                        </form>
                         {responseMessage && (
                            <div className={`mt-6 text-center font-mono p-3 rounded-md ${
                                status === 'success' ? 'bg-green-500/10 text-green-400' : ''
                            } ${
                                status === 'error' ? 'bg-red-500/10 text-red-400' : ''
                            }`}>
                                {responseMessage}
                            </div>
                        )}
                    </GlowPanel>
                </div>
            </div>
        </Section>
    );
};

export default ContactPage;