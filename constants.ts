// Fix: Create constants.ts to provide shared data for the application.
import { TeamMember, Announcement, EventShowcase, YouTubeVideo, NavLink, Coordinatorship, Department } from './types';

export const NAV_LINKS: NavLink[] = [
    { name: 'Anasayfa', href: '/' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Ekibimiz', href: '/team' },
    { name: 'Etkinlikler', href: '/events' },
    { name: 'İletişim', href: '/contact' },
];

export const TEAM_DATA: TeamMember[] = [
    { id: 1, name: 'Tülay Turhan', role: 'Yönetim Kurulu Başkanı', image: 'https://picsum.photos/seed/member1/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 2, name: 'Aleyna Günalay', role: 'Yönetim Kurulu Başkan Yardımcısı', image: 'https://picsum.photos/seed/member2/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
    { id: 3, name: 'Berat Şimşek', role: 'Sayman', image: 'https://picsum.photos/seed/member3/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 4, name: 'Ozan Efe Akpınar', role: 'Reklam ve Tanıtım Koordinatörlüğü Direktörü', image: 'https://picsum.photos/seed/member4/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 5, name: 'Zeynep Ece Öztemel', role: 'Reklam ve Tanıtım Koordinatörlüğü Eş Koordinatörü', image: 'https://picsum.photos/seed/member5/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
    { id: 6, name: 'Mert Kasçı', role: 'Reklam ve Tanıtım Koordinatörlüğü Eş Koordinatörü', image: 'https://picsum.photos/seed/member6/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 7, name: 'Ahmet Çelen', role: 'Teknik Etkinlik Koordinatörlüğü Direktörü', image: 'https://picsum.photos/seed/member7/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 8, name: 'Beytullah Zeyd Yıldız', role: 'Teknik Etkinlik Koordinatörlüğü Koordinatörü', image: 'https://picsum.photos/seed/member8/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
    { id: 9, name: 'Fatih Hasan Önsesveren', role: 'AR-GE Birimi Başkanı', image: 'https://picsum.photos/seed/member9/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 10, name: 'Kıvılcım Nehir Bozburun', role: 'Kurumsal İlişkiler Koordinatörlüğü Eş Direktörü', image: 'https://picsum.photos/seed/member10/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 11, name: 'Zeynep Çiftçi', role: 'Kurumsal İlişkiler Koordinatörlüğü Eş Direktörü', image: 'https://picsum.photos/seed/member11/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
    { id: 12, name: 'Alper Yörük', role: 'Kurumsal İlişkiler Koordinatörlüğü Eş Koordinatörü', image: 'https://picsum.photos/seed/member12/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 13, name: 'Eylül Berken Kavlak', role: 'Kurumsal İlişkiler Koordinatörlüğü Eş Koordinatörü', image: 'https://picsum.photos/seed/member13/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 14, name: 'Taner Karakaş', role: 'Kurumsal İlişkiler Koordinatörlüğü Eş Koordinatörü', image: 'https://picsum.photos/seed/member14/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 15, name: 'Arda Samed Özkılıç', role: 'Sosyal Etkinlik Koordinatörlüğü Eş Direktörü', image: 'https://picsum.photos/seed/member15/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
    { id: 16, name: 'Can Çetin', role: 'Sosyal Etkinlik Koordinatörlüğü Eş Direktörü', image: 'https://picsum.photos/seed/member16/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 17, name: 'Yaman Has', role: 'Sosyal Etkinlik Koordinatörlüğü Koordinatörü', image: 'https://picsum.photos/seed/member17/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 18, name: 'Elif Badak', role: 'Halkla İlişkiler Koordinatörlüğü Direktörü', image: 'https://picsum.photos/seed/member18/400/400', social: { linkedin: '#', instagram: '#' } },
    { id: 19, name: 'Asude Sivritepe', role: 'Halkla İlişkiler Koordinatörlüğü Koordinatörü', image: 'https://picsum.photos/seed/member19/400/400', social: { linkedin: '#', instagram: '#', twitter: '#' } },
];

export const ANNOUNCEMENTS_DATA: Announcement[] = [
    { id: 1, title: 'Fall \'24 Kick-Off Meeting', description: 'Join us for our first meeting of the semester! Learn about our plans, upcoming events, and how you can get involved.', image: 'https://picsum.photos/seed/announcement1/800/600' },
    { id: 2, title: 'Workshop: Intro to Git & GitHub', description: 'Master the basics of version control. This hands-on workshop is perfect for beginners.', image: 'https://picsum.photos/seed/announcement2/800/600' },
    { id: 3, title: 'Call for SIG Leaders', description: 'Want to lead a special interest group? We\'re looking for passionate students to head our SIGs in AI, Cybersecurity, and Game Dev.', image: 'https://picsum.photos/seed/announcement3/800/600' },
];

export const EVENT_SHOWCASE_DATA: EventShowcase[] = [
    {
        id: 'senin-yerin-neresi',
        title: 'Senin Yerin Neresi?',
        description: 'ACM Hacettepe topluluğunun yönetim kurulu ekibini, koordinatörlükleri ve bu koordinatörlüklerin neler yaptığını, etkinliklerini tanıtan, yılın ilk etkinliğidir.',
        images: [
            'https://picsum.photos/seed/event1-img1/800/450',
            'https://picsum.photos/seed/event1-img2/800/450',
            'https://picsum.photos/seed/event1-img3/800/450',
            'https://picsum.photos/seed/event1-img4/800/450',
        ]
    },
    {
        id: 'fasil',
        title: 'Fasıl',
        description: 'ACM Hacettepe ailesi olarak eski-yeni yönetim kurulunu ve üyelerini bir araya getirip, topluluğun doğum gününü kutladığı gelenekselleşmiş bir etkinliktir. Bu etkinlik yönetim kurulu ve üyeler arasında bir köprü kurulmasını ve üyelerin beraber eğlenmelerini hedefler.',
        images: [
            'https://picsum.photos/seed/event2-img1/800/450',
            'https://picsum.photos/seed/event2-img2/800/450',
            'https://picsum.photos/seed/event2-img3/800/450',
        ]
    },
    {
        id: 'mor-geyik',
        title: 'Mor Geyik',
        description: "Türkiye'nin en saygın üniversitelerinden Hacettepe Üniversitesi'nin Beytepe Kampüsü'nde ACM Hacettepe Öğrenci Topluluğu tarafından ilki 2017'de gerçekleştirilen Mor Geyik, öğrencileri sektörün farklı alanlarında tanınmış ve başarı kazanmış insanlarla samimi bir sohbet havasında bir araya getirmeyi amaçlayan bir etkinliktir. Bu etkinlikte öğrenciler katılımcılarımız ile özel bir bağ kurarak onların hayat tecrübelerini ve tavsiyelerini dinlerken aynı zamanda akıllarındaki sorulara cevap bulma fırsatını yakalayabilecekler.",
        images: [
            'https://picsum.photos/seed/event3-img1/800/450',
            'https://picsum.photos/seed/event3-img2/800/450',
            'https://picsum.photos/seed/event3-img3/800/450',
            'https://picsum.photos/seed/event3-img4/800/450',
        ]
    },
    {
        id: 'hujam',
        title: 'HUJAM',
        description: 'Hacettepe Üniversitesi Game Jam, ilk kez 2021’de düzenlediğimiz, 72 saatlik bir oyun geliştirme yarışmasıdır. Etkinlik; Hacettepe öğrencileri başta olmak üzere, oyun geliştirmeye ilgi duyan ve kendini geliştirmek isteyen tüm öğrencilere açıktır. Katılımcılar, başlangıçta açıklanan tema doğrultusunda bireysel veya takım halinde oyunlarını geliştirir. Süre sonunda oyunlar önce katılımcılar arasında ön eleme oylamasına girer, ardından jüri değerlendirmesiyle dereceye giren takımlar ödüllendirilir.',
        images: [
            'https://picsum.photos/seed/event4-img1/800/450',
            'https://picsum.photos/seed/event4-img2/800/450',
            'https://picsum.photos/seed/event4-img3/800/450',
        ]
    },
    {
        id: 'gelisim',
        title: 'Gelişim',
        description: 'Gelişim etkinliği ile Hacettepe Üniversitesi öğrencilerinin kişisel olarak güçlenmelerini, mesleki açıdan farkındalıklarının artmasını, sosyalleşmelerine olanak sağlamayı ve değerli konuşmacılarımızın ilham veren kariyerleri doğrultusunda öğrencilerin kendi kariyerlerine yön vermesini hedefliyoruz.',
        images: [
            'https://picsum.photos/seed/event5-img1/800/450',
            'https://picsum.photos/seed/event5-img2/800/450',
            'https://picsum.photos/seed/event5-img3/800/450',
        ]
    },
    {
        id: 'huprog',
        title: 'HUPROG',
        description: "İlkini 2016'da gerçekleştirdiğimiz Hacettepe Üniversitesi Programlama Yarışması, Türkiye genelindeki tüm üniversite öğrencilerine açık bir rekabetçi programlama yarışmasıdır. Yarışmamızın en büyük amacı Türkiye'deki gençleri algoritmik düşünceye teşvik etmek ve \"competitive programming\" kültürünü geliştirmektir.",
        images: [
            'https://picsum.photos/seed/event6-img1/800/450',
            'https://picsum.photos/seed/event6-img2/800/450',
            'https://picsum.photos/seed/event6-img3/800/450',
        ]
    },
    {
        id: 'sms',
        title: 'SMS',
        description: "Sosyal Medya Söyleşileri, sosyal medyanın gücünün ve etkisinin ön planda olduğu bu etkinlikte sosyal medyanın şirketler için önemi, günlük hayatımızda sosyal medyanın yeri, sosyal medyayı etkili kullanmak gibi genel konular yer almaktadır. Konuşmacıların, kendilerinin veya içinde bulundukları oluşumların adına şu anki konumlarına nasıl geldiklerini, karşılaştıkları güçlükleri, eğlenceli anılarını ve kazandıkları başarıları bizlerle paylaşacağı sohbet tadında bir söyleşi etkinliğidir.",
        images: [
            'https://picsum.photos/seed/event61-img1/800/450',
            'https://picsum.photos/seed/event61-img2/800/450',
            'https://picsum.photos/seed/event61-img3/800/450',
        ]
    },
    {
        id: 'acsdays',
        title: 'ACS Days',
        description: "Ankara Computer Science Days (ACS Days), ulusal çapta bilgisayar bilimleri üzerine düzenlenen konferans ve eğitimlerden oluşan bir etkinliktir. Etkinlik süresince bilgisayar bilimlerinin farklı alanlarına yönelik eş zamanlı oturumlar ve atölyeler gerçekleştirilir.\n\nÜlkemizde nadir düzenlenen bilgisayar bilimi odaklı etkinliklerden biri olan ACSDays’in amacı; bu alana ilgi duyan veya bilgisayar bilimleri bölümlerinde okuyan bireylerin teknik becerilerini geliştirmelerine, akademi ve sektörle bağlantı kurmalarına ve güçlü bir iletişim ağı oluşturmalarına olanak tanımaktır. Ayrıca bilgisayar bilimleri alanında hissedilen etkinlik açığını kapatmayı hedefler.",
        images: [
            'https://picsum.photos/seed/event7-img1/800/450',
            'https://picsum.photos/seed/event7-img2/800/450',
            'https://picsum.photos/seed/event7-img3/800/450',
        ]
    },
    {
        id: 'liderlik-kampi',
        title: 'Liderlik Kampı',
        description: "Her yıl düzenli olarak gerçekleştirilen Liderlik Kampı, ACM Hacettepe Öğrenci Topluluğu’nun en önemli etkinliklerinden biridir. Gelecekte yönetim kurulunda görev almak isteyen ya da liderlik becerilerini geliştirmeyi amaçlayan aktif üyelerimizin katılımıyla, Ankara dışında bir kamp-eğitim merkezinde gerçekleştirilir.\n\nDoğayla iç içe, dış dünyadan uzak bir ortamda geçen iki günlük kamp boyunca; interaktif oyunlar ve aktivitelerle iletişim, takım çalışması, liderlik, zaman ve kriz yönetimi gibi beceriler sınanır. Bu süreçte topluluğun deneyimli danışma kurulu üyeleri katılımcıları gözlemleyerek yönetim kurulu adayları hakkında rapor hazırlar; bu rapor mülakatlarda önemli bir rol oynar.\n\nLiderlik Kampı aynı zamanda üyelerimizin birbirlerini daha yakından tanıdığı, samimi bir ortamda keyifli vakit geçirerek dostluk ve dayanışma bağlarını güçlendirdiği özel bir etkinliktir.",
        images: [
            'https://picsum.photos/seed/event8-img1/800/450',
            'https://picsum.photos/seed/event8-img2/800/450',
            'https://picsum.photos/seed/event8-img3/800/450',
        ]
    },
    {
        id: 'teknik-ders-soylesiler',
        title: 'Teknik Dersler ve Söyleşiler',
        description: "Bilişim alanında ün salmış eğitmenler ile bu alanda kendini geliştirmeyi amaçlayan öğrencileri çeşitli etkinik, dersler ve söyleşiler ile bir araya getirmeyi hedefleyen etkinliklerdir.",
        images: [
            'https://picsum.photos/seed/event9-img1/800/450',
            'https://picsum.photos/seed/event9-img2/800/450',
            'https://picsum.photos/seed/event9-img3/800/450',
        ]
    },
    {
        id: 'teknik-geziler',
        title: 'Teknik Geziler',
        description: "Üyelerimize profesyonel çalışma ortamlarını gösterebilmek ve şirketler ile etkileşim halinde bulunarak iş hayatlarına bakışlarını geliştirmek adına belirli profesyonel ve kurumsal firmalara teknik geziler düzenlemekteyiz.",
        images: [
            'https://picsum.photos/seed/event10-img1/800/450',
            'https://picsum.photos/seed/event10-img2/800/450',
            'https://picsum.photos/seed/event10-img3/800/450',
        ]
    }
];

export const YOUTUBE_VIDEOS_DATA: YouTubeVideo[] = [
    { id: 'dQw4w9WgXcQ', title: 'Panel: A Career in Software Engineering', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
    { id: '3qHk6n83gS4', title: 'Tech Talk: The Future of Quantum Computing', thumbnail: 'https://i.ytimg.com/vi/3qHk6n83gS4/hqdefault.jpg' },
    { id: 'p4Q3y3-3-cM', title: 'Workshop Recap: Building a React App from Scratch', thumbnail: 'https://i.ytimg.com/vi/p4Q3y3-3-cM/hqdefault.jpg' },
    { id: 'Y85_D4_a-5c', title: 'Interview with a Google Engineer', thumbnail: 'https://i.ytimg.com/vi/Y85_D4_a-5c/hqdefault.jpg' },
];

export const COORDINATORSHIP_PREFERENCES: Coordinatorship[] = [
  { label: 'Halkla İlişkiler Koordinatörlüğü', acronym: 'HİK' },
  { label: 'Kurumsal İlişkiler Koordinatörlüğü', acronym: 'KİK' },
  { label: 'Reklam ve Tanıtım Koordinatörlüğü', acronym: 'RT' },
  { label: 'Sosyal Etkinlik Koordinatörlüğü', acronym: 'SEK' },
  { label: 'Teknik Etkinlik Koordinatörlüğü', acronym: 'TEK' },
  { label: 'Ar-Ge Birimi', acronym: 'AR-GE' }
];

export const HEAR_ABOUT_US_OPTIONS = [
  'Sosyal Medya',
  'Kampüs İçi Tanıtım',
  'WhatsApp Grupları',
  'Geçmiş Etkinlikler',
  'Arkadaş',
  'Diğer'
];

export const DEPARTMENT_OPTIONS: Department[] = [
    { label: 'Computer Engineering', value: 'Computer Engineering' },
    { label: 'Software Engineering', value: 'Software Engineering' },
    { label: 'Artificial Intelligence Engineering', value: 'Artificial Intelligence Engineering' },
    { label: 'Electrical and Electronics Engineering', value: 'Electrical and Electronics Engineering' },
    { label: 'Industrial Engineering', value: 'Industrial Engineering' },
    { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
    { label: 'Civil Engineering', value: 'Civil Engineering' },
    { label: 'Chemical Engineering', value: 'Chemical Engineering' },
    { label: 'Geomatics Engineering', value: 'Geomatics Engineering' },
    { label: 'Nuclear Engineering', value: 'Nuclear Engineering' },
    { label: 'Physics Engineering', value: 'Physics Engineering' },
    { label: 'Medicine (English)', value: 'Medicine (English)' },
    { label: 'Medicine (Turkish)', value: 'Medicine (Turkish)' },
    { label: 'Dentistry', value: 'Dentistry' },
    { label: 'Pharmacy', value: 'Pharmacy' },
    { label: 'Business Administration', value: 'Business Administration' },
    { label: 'Economics', value: 'Economics' },
    { label: 'International Relations', value: 'International Relations' },
    { label: 'Political Science and Public Administration', value: 'Political Science and Public Administration' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Statistics', value: 'Statistics' },
    { label: 'Actuarial Sciences', value: 'Actuarial Sciences' },
    { label: 'Biology', value: 'Biology' },
    { label: 'Chemistry', value: 'Chemistry' },
    { label: 'Psychology', value: 'Psychology' },
    { label: 'Sociology', value: 'Sociology' },
    { label: 'History', value: 'History' },
    { label: 'Turkish Language and Literature', value: 'Turkish Language and Literature' },
    { label: 'English Language and Literature', value: 'English Language and Literature' },
    { label: 'American Culture and Literature', value: 'American Culture and Literature' },
    { label: 'German Language and Literature', value: 'German Language and Literature' },
    { label: 'French Language and Literature', value: 'French Language and Literature' },
    { label: 'Translation and Interpreting (English)', value: 'Translation and Interpreting (English)' },
    { label: 'Fine Arts', value: 'Fine Arts' },
    { label: 'Other', value: 'Other' },
];

export const GRADE_OPTIONS = [
    'Hazırlık',
    '1. Sınıf',
    '2. Sınıf',
    '3. Sınıf',
    '4. Sınıf',
    'Lisansüstü',
    'Diğer'
];