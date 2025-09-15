import React from 'react';
import Section from '../components/Section';
import GlowPanel from '../components/GlowPanel';

const AboutPage: React.FC = () => {
    return (
        <Section id="about" title="[Hakkımızda]">
            <div className="space-y-20 md:space-y-28">

                {/* Section 1: What is ACM? */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
                            <img 
                                src="https://picsum.photos/seed/acm-global/800/600"
                                alt="ACM Logo"
                                className="rounded-md w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Text Column */}
                    <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg">
                        <h3 className="text-3xl font-bold font-mono text-purple-400 mb-4">ACM Nedir?</h3>
                        <div className="space-y-4 font-mono text-slate-300">
                            <p><span className="text-purple-500">[misyon]</span> ACM (Association for Computing Machinery), bilgisayar mühendisliği bilimini bir araya getirmek için 1947'de kurulmuş ve gün geçtikçe büyüyerek dünya çapında tanınan bir kuruluştur. Merkezi New York şehrinde olan ACM; dünya genelinde çeşitli şubeleri, profesyonel kulüpleri, özel araştırma gruplarını ve öğrenci kollarını bünyesinde barındırmaktadır.</p>
                            <p><span className="text-purple-500">[vizyon]</span> ACM, mesleki akademik yayın ve toplantı faaliyetlerinin yanı sıra bilgisayar bilimlerinin Nobel'i sayılan Turing Ödülü'nü veren kuruluş olarak da bilinir. Dünya genelini kapsayan üyelik sistemi sayesinde bilişim teknolojisinin çeşitli alanları ile uğraşan profesyonellere ve öğrencilere kaynak sağlamaktadır.</p>
                        </div>
                    </GlowPanel>
                </div>

                {/* Section 2: ACM Hacettepe Student Chapter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Column */}
                    <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg lg:order-first">
                        <h3 className="text-3xl font-bold font-mono text-purple-400 mb-4">ACM Hacettepe Öğrenci Topluluğu</h3>
                        <div className="space-y-4 font-mono text-slate-300">
                            <p><span className="text-purple-500">[kuruluş]</span> ACM Hacettepe Öğrenci Topluluğu; 2010 yılında kurulmuş olup ACM'in Türkiye'de bulunan 13 öğrenci kolundan biridir. Topluluğumuz kurulduğu günden bu yana her geçen gün artan üye sayısıyla Hacettepe Üniversitesinin en büyük topluluklarından biri haline gelmiştir.</p>
                            <p><span className="text-purple-500">[misyon]</span> ACM Hacettepe Öğrenci Topluluğu olarak amacımız teknik ve sosyal alanda yapılan etkinliklerle öğrencilerimizi her iki alanda da bilgi sahibi olmuş, gelişmiş bir birey haline getirmektir. Topluluğumuzun en önemli görevi; öğrencilerimizin meslek hayatı ile ilgili sorularına cevap bulacağı seminerler düzenlemek, iş hayatlarında onlara yardımcı olacak teknik bilgiler vermek ve bu bilgileri teknik geziler ile desteklemektir. Ayrıca yapılan sosyal etkinliklerle öğrencilerimizin sosyal yönü gelişmiş bireyler olmasını hedefliyoruz.</p>
                        </div>
                    </GlowPanel>
                    
                    {/* Image Column */}
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
                            <img 
                                src="https://picsum.photos/seed/hacettepe-chapter/800/600"
                                alt="ACM Hacettepe Team Collaboration"
                                className="rounded-md w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
};

export default AboutPage;