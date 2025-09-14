import React, { useState } from 'react';
import Section from '../components/Section';
import GlowPanel from '../components/GlowPanel';
import { 
    COORDINATORSHIP_PREFERENCES, 
    HEAR_ABOUT_US_OPTIONS,
    DEPARTMENT_OPTIONS,
    GRADE_OPTIONS
} from '../constants';
import SearchableSelect from '../components/SearchableSelect';

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        nameSurname: '',
        phone: '',
        schoolNo: '',
        email: '',
        department: '',
        classroom: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
        grade: '',
        howHear: '',
        preference1: '',
        preference2: '',
        coordinatorshipReason: '',
        wantsActiveMember: false,
        wantsWhatsapp: false,
        wantsSmsEmail: false,
        hasApprovedConsent: false,
    });

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setResponseMessage('');

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            await new Promise(res => setTimeout(res, 1500));

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            setStatus('success');
            setResponseMessage('Sign up successful! Redirecting to our Instagram...');
            setTimeout(() => {
                window.location.href = 'https://instagram.com/acmhacettepe';
            }, 2000);

        } catch (error) {
            console.error('Sign-up form submission error:', error);
            setStatus('error');
            setResponseMessage('An error occurred during submission. Please try again later.');
        }
    };

    const getCoordinatorshipQuestion = () => {
        const { preference1, preference2 } = formData;
        if (!preference1) return null;

        let preferencesText;
        if (preference1 && !preference2) {
            preferencesText = preference1;
        } else if (preference1 && preference2) {
            preferencesText = `${preference1} and ${preference2}`;
        } else {
             return null;
        }

        return `Why did you choose ${preferencesText}?`;
    };

    const inputStyles = "w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";
    const labelStyles = "block text-sm font-mono text-purple-400 mb-2";

    const preference2Options = COORDINATORSHIP_PREFERENCES.filter(p => p.acronym !== formData.preference1);
    
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - 15 - i);


    return (
        <Section id="signup" title="[Join_The_Chapter]">
            <div className="max-w-5xl mx-auto">
                <p className="text-center text-lg text-slate-400 mb-12">
                    Ready to be part of our community? Fill out the form below to start your journey with ACM Hacettepe.
                </p>
                <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* --- Left Column --- */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="nameSurname" className={labelStyles}>Name Surname *</label>
                                    <input type="text" id="nameSurname" name="nameSurname" value={formData.nameSurname} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="schoolNo" className={labelStyles}>School No *</label>
                                    <input type="text" id="schoolNo" name="schoolNo" value={formData.schoolNo} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="department" className={labelStyles}>Department *</label>
                                    <SearchableSelect
                                        options={DEPARTMENT_OPTIONS}
                                        value={formData.department}
                                        onChange={(value) => setFormData(prev => ({...prev, department: value}))}
                                        placeholder="Search for your department"
                                    />
                                     <input type="hidden" name="department" value={formData.department} required />
                                </div>
                                <div>
                                    <label className={labelStyles}>Date of Birth *</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select name="dobDay" value={formData.dobDay} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Day</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                        <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Month</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
                                        <select name="dobYear" value={formData.dobYear} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="howHear" className={labelStyles}>How did you hear about us? *</label>
                                    <select id="howHear" name="howHear" value={formData.howHear} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Select an option</option>
                                        {HEAR_ABOUT_US_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* --- Right Column --- */}
                             <div className="space-y-6">
                                <div>
                                    <label htmlFor="phone" className={labelStyles}>Phone number *</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="email" className={labelStyles}>Email *</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="classroom" className={labelStyles}>Classroom *</label>
                                    <input type="text" id="classroom" name="classroom" value={formData.classroom} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="grade" className={labelStyles}>Grade *</label>
                                    <select id="grade" name="grade" value={formData.grade} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Select your grade</option>
                                        {GRADE_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="preference1" className={labelStyles}>1. Preference *</label>
                                    <select id="preference1" name="preference1" value={formData.preference1} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Select first preference</option>
                                        {COORDINATORSHIP_PREFERENCES.map(coord => (
                                            <option key={coord.acronym} value={coord.acronym}>{coord.label}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="preference2" className={labelStyles}>2. Preference</label>
                                    <select id="preference2" name="preference2" value={formData.preference2} onChange={handleChange} className={`${inputStyles} appearance-none`} disabled={!formData.preference1}>
                                        <option value="">Select second preference</option>
                                        {preference2Options.map(coord => (
                                            <option key={coord.acronym} value={coord.acronym}>{coord.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- Dynamic Reason Textarea --- */}
                        {formData.preference1 && (
                            <div>
                                <label htmlFor="coordinatorshipReason" className={labelStyles}>
                                    {getCoordinatorshipQuestion()} *
                                </label>
                                <textarea
                                    id="coordinatorshipReason"
                                    name="coordinatorshipReason"
                                    rows={4}
                                    value={formData.coordinatorshipReason}
                                    onChange={handleChange}
                                    required
                                    className={inputStyles}
                                    placeholder="Tell us about your interest..."
                                />
                            </div>
                        )}

                        {/* --- Checkboxes --- */}
                        <div className="space-y-4 pt-4 border-t border-slate-700">
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsActiveMember" checked={formData.wantsActiveMember} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>I want to become an active member.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsWhatsapp" checked={formData.wantsWhatsapp} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>I want to be added to Whatsapp ACM Hacettepe groups.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsSmsEmail" checked={formData.wantsSmsEmail} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>I would like to receive announcements or innovations via SMS and Email.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="hasApprovedConsent" checked={formData.hasApprovedConsent} onChange={handleCheckboxChange} required className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>
                                    <a href="#" className="underline text-purple-400 hover:text-purple-300 transition-colors">Illuminating text</a> I have read and approve. <span className="text-red-500">*</span>
                                </span>
                            </label>
                        </div>


                        <div className="flex items-center justify-between gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className="w-full px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                <span className="relative glitch-hover" data-text={status === 'sending' ? 'Submitting...' : 'Sign Up'}>
                                    {status === 'sending' ? 'Submitting...' : 'Sign Up'}
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
        </Section>
    );
};

export default SignUpPage;