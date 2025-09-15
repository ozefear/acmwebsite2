import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust the path if needed
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
              // Add a timestamp field automatically
            //  DUE TESTING - related firebase.js and dependencies under package.json (npm install firestore MAY BE REQUIRED)
            // NO THE TESTING MESSAGE IS FROM ME, FATIH.
              await addDoc(collection(db, "signups"), {
                ...formData,
                submittedAt: serverTimestamp(),
              });
            
              setStatus('success');
              setResponseMessage('Kayıt formunuz başarıyla gönderildi! Yönlendiriliyorsunuz...');
              setTimeout(() => {
                window.location.href = 'https://instagram.com/acmhacettepe';
              }, 2000);
        } catch (error) {
              console.error('Firestore submission error:', error);
              setStatus('error');
              setResponseMessage('Gönderim sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }

    };

    const getCoordinatorshipQuestion = () => {
        const { preference1, preference2 } = formData;
        if (!preference1) return null;

        let preferencesText;
        if (preference1 && !preference2) {
            preferencesText = preference1;
        } else if (preference1 && preference2) {
            preferencesText = `${preference1} ve ${preference2}`;
        } else {
             return null;
        }

        return `Neden ${preferencesText} tercih ettiniz?`;
    };

    const inputStyles = "w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";
    const labelStyles = "block text-sm font-mono text-purple-400 mb-2";

    const preference2Options = COORDINATORSHIP_PREFERENCES.filter(p => p.acronym !== formData.preference1);
    
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - 15 - i);


    return (
        <Section id="signup" title="[Bize_Katıl]">
            <div className="max-w-5xl mx-auto">
                <p className="text-center text-lg text-slate-400 mb-12">
                    Topluluğumuzun bir parçası olmaya hazır mısınız? ACM Hacettepe ile yolculuğunuza başlamak için aşağıdaki formu doldurun.
                </p>
                <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* --- Left Column --- */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="nameSurname" className={labelStyles}>Ad Soyad *</label>
                                    <input type="text" id="nameSurname" name="nameSurname" value={formData.nameSurname} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="schoolNo" className={labelStyles}>Okul No *</label>
                                    <input type="text" id="schoolNo" name="schoolNo" value={formData.schoolNo} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="department" className={labelStyles}>Bölüm *</label>
                                    <SearchableSelect
                                        options={DEPARTMENT_OPTIONS}
                                        value={formData.department}
                                        onChange={(value) => setFormData(prev => ({...prev, department: value}))}
                                        placeholder="Bölümünüzü arayın..."
                                    />
                                     <input type="hidden" name="department" value={formData.department} required />
                                </div>
                                <div>
                                    <label className={labelStyles}>Doğum Tarihi *</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select name="dobDay" value={formData.dobDay} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Gün</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                        <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Ay</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
                                        <select name="dobYear" value={formData.dobYear} onChange={handleChange} required className={`${inputStyles} appearance-none`}><option value="">Yıl</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="howHear" className={labelStyles}>Bizden nasıl haberdar oldunuz? *</label>
                                    <select id="howHear" name="howHear" value={formData.howHear} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Bir seçenek belirleyin</option>
                                        {HEAR_ABOUT_US_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* --- Right Column --- */}
                             <div className="space-y-6">
                                <div>
                                    <label htmlFor="phone" className={labelStyles}>Telefon Numarası *</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="email" className={labelStyles}>Email *</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="grade" className={labelStyles}>Sınıf Seviyesi *</label>
                                    <select id="grade" name="grade" value={formData.grade} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Seviyenizi seçin</option>
                                        {GRADE_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="preference1" className={labelStyles}>1. Tercih *</label>
                                    <select id="preference1" name="preference1" value={formData.preference1} onChange={handleChange} required className={`${inputStyles} appearance-none`}>
                                        <option value="" disabled>Birinci tercihi seçin</option>
                                        {COORDINATORSHIP_PREFERENCES.map(coord => (
                                            <option 
                                                key={coord.acronym} 
                                                value={coord.acronym}
                                                disabled={coord.acronym === 'AR-GE'}
                                                className={coord.acronym === 'AR-GE' ? 'text-slate-500' : ''}
                                            >
                                                {coord.label} {coord.acronym === 'AR-GE' && '(Başvurular ayrı yapılmaktadır)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="preference2" className={labelStyles}>2. Tercih *</label>
                                    <select id="preference2" name="preference2" value={formData.preference2} onChange={handleChange} required className={`${inputStyles} appearance-none`} disabled={!formData.preference1}>
                                        <option value="" disabled>İkinci tercihi seçin</option>
                                        {preference2Options.map(coord => (
                                            <option 
                                                key={coord.acronym} 
                                                value={coord.acronym}
                                                disabled={coord.acronym === 'AR-GE'}
                                                className={coord.acronym === 'AR-GE' ? 'text-slate-500' : ''}
                                            >
                                                {coord.label} {coord.acronym === 'AR-GE' && '(Başvurular ayrı yapılmaktadır)'}
                                            </option>
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
                                    placeholder="Neden bu koordinatörlükleri seçtiniz, bu kordinatörlüklerle ilgili en çok ilginizi çeken ne oldu?..."
                                />
                            </div>
                        )}

                        {/* --- Checkboxes --- */}
                        <div className="space-y-4 pt-4 border-t border-slate-700">
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsActiveMember" checked={formData.wantsActiveMember} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>Aktif üye olmak istiyorum.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsWhatsapp" checked={formData.wantsWhatsapp} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>Whatsapp ACM Hacettepe gruplarına eklenmek istiyorum.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="wantsSmsEmail" checked={formData.wantsSmsEmail} onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>Duyuru veya yenilikleri SMS ve E-posta ile almak istiyorum.</span>
                            </label>
                             <label className="flex items-center space-x-3 font-mono text-slate-300 cursor-pointer">
                                <input type="checkbox" name="hasApprovedConsent" checked={formData.hasApprovedConsent} onChange={handleCheckboxChange} required className="form-checkbox h-5 w-5 bg-slate-800 border-slate-600 rounded text-purple-500 focus:ring-purple-500" />
                                <span>
                                    <a href="#" className="underline text-purple-400 hover:text-purple-300 transition-colors">Aydınlatma metnini</a> okudum ve onaylıyorum. <span className="text-red-500">*</span>
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
                                <span className="relative glitch-hover" data-text={status === 'sending' ? 'Gönderiliyor...' : 'Kayıt Ol'}>
                                    {status === 'sending' ? 'Gönderiliyor...' : 'Kayıt Ol'}
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

                    <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                        <p className="font-mono text-slate-400">
                            Ar-Ge birimimize başvurmak için buraya tıklayabilirsiniz:
                        </p>
                        <a 
                            href="https://arge.acmhacettepe.com/join-us" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block mt-2 font-mono text-purple-400 hover:text-purple-300 underline transition-colors glitch-hover" 
                            data-text="arge.acmhacettepe.com/join-us"
                        >
                            arge.acmhacettepe.com/join-us
                        </a>
                    </div>
                </GlowPanel>
            </div>
        </Section>
    );
};

export default SignUpPage;
