import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
    en: {
        nav: { find: 'Find Parking', dash: 'Dashboard', login: 'Login', reg: 'Register', out: 'Logout' },
        home: { 
            hero: 'Find Your Perfect Parking Space', 
            sub: 'Book instantly in your city.', 
            dest: 'Destination', destPh: 'City, mall, or street...',
            date: 'Date', time: 'Time',
            blast: 'SEARCH NOW',
            featuresTitle: 'Next-Gen Parking', featuresSub: 'We make parking seamless for everyone.',
            radar: 'Instant Radar', radarDesc: 'Find the absolute closest and cheapest parking spots near your destination instantly.',
            lock: 'Ironclad Lock', lockDesc: 'Book in advance and never worry about finding a space when you arrive.',
            sync: 'Garage Sync', syncDesc: 'Save multiple vehicles and switch between them seamlessly when booking.'
        },
        find: {
            title: 'Available Locations', found: 'found', filters: 'Filters',
            city: 'City', allCities: 'All Cities', searchPh: 'Search by location name or address...',
            split: 'Split View', map: 'Map', list: 'List', distance: 'Distance',
            vehicleType: 'Vehicle Type', car: 'Car', bike: 'Bike',
            start: 'Starting from', book: 'Book Spot', noSpots: 'No parking spots found',
            tryDiff: 'Try changing your city or search filter to find available locations.'
        },
        details: {
            entrance: 'Entrance', free: 'Free', full: 'Full', selected: 'Selected',
            date: 'Date', start: 'Start Time', duration: 'Duration',
            summary: 'Booking Details', slot: 'Selected Slot', rate: 'Rate', total: 'Total', none: 'None',
            continue: 'Continue to Book'
        },
        book: {
            vehicle: 'Vehicle Number', vehiclePh: 'e.g. MH 12 AB 1234',
            next: 'Next Step', back: 'Back', secure: 'Secure Checkout',
            totalAmt: 'Total Amount',
            card: 'Credit / Debit Card', cardSub: 'Pay securely with your bank card',
            upi: 'UPI / QR Code', upiSub: 'GPay, PhonePe, Paytm, etc.', fast: 'Fastest',
            scan: 'Scan to Pay Instantly', await: 'Awaiting Payment Confirmation...',
            confirm: 'Confirm Payment', process: 'Processing',
            success: 'Pass Confirmed',
            down: 'Download PDF', myDash: 'My Dashboard'
        }
    },
    mr: {
        nav: { find: 'पार्किंग शोधा', dash: 'डॅशबोर्ड', login: 'लॉगिन करा', reg: 'नोंदणी करा', out: 'बाहेर पडा' },
        home: { 
            hero: 'तुमची परिपूर्ण पार्किंग जागा शोधा', 
            sub: 'तुमच्या शहरात त्वरित बुक करा.', 
            dest: 'ठिकाण', destPh: 'शहर, मॉल किंवा रस्ता...',
            date: 'तारीख', time: 'वेळ',
            blast: 'आता शोधा',
            featuresTitle: 'नेक्स्ट-जेन पार्किंग', featuresSub: 'आम्ही सर्वांसाठी पार्किंग सोपे करतो.',
            radar: 'झटपट रडार', radarDesc: 'तुमच्या गंतव्यस्थानाजवळील सर्वात जवळची आणि स्वस्त पार्किंगची ठिकाणे त्वरित शोधा.',
            lock: 'सुरक्षित बुकिंग', lockDesc: 'आगाऊ बुक करा आणि तुम्ही आल्यावर जागा शोधण्याची काळजी करू नका.',
            sync: 'गॅरेज सिंक', syncDesc: 'एकाधिक वाहने जतन करा आणि बुकिंग करताना त्यांच्यामध्ये अखंडपणे स्विच करा.'
        },
        find: {
            title: 'उपलब्ध ठिकाणे', found: 'सापडले', filters: 'फिल्टर्स',
            city: 'शहर', allCities: 'सर्व शहरे', searchPh: 'ठिकाणाचे नाव किंवा पत्त्यानुसार शोधा...',
            split: 'स्प्लिट व्ह्यू', map: 'नकाशा', list: 'यादी', distance: 'अंतर',
            vehicleType: 'वाहन प्रकार', car: 'कार', bike: 'बाईक',
            start: 'सुरुवातीची किंमत', book: 'जागा बुक करा', noSpots: 'कोणतीही पार्किंग जागा सापडली नाही',
            tryDiff: 'उपलब्ध ठिकाणे शोधण्यासाठी तुमचे शहर किंवा शोध फिल्टर बदलून पहा.'
        },
        details: {
            entrance: 'प्रवेशद्वार', free: 'मोफत', full: 'पूर्ण', selected: 'निवडले',
            date: 'तारीख', start: 'सुरुवातीची वेळ', duration: 'कालावधी',
            summary: 'बुकिंग तपशील', slot: 'निवडलेली जागा', rate: 'दर', total: 'एकूण', none: 'काहीही नाही',
            continue: 'बुकिंग सुरू ठेवा'
        },
        book: {
            vehicle: 'वाहन क्रमांक', vehiclePh: 'उदा. MH 12 AB 1234',
            next: 'पुढील पायरी', back: 'मागे', secure: 'सुरक्षित पेमेंट',
            totalAmt: 'एकूण रक्कम',
            card: 'क्रेडिट / डेबिट कार्ड', cardSub: 'तुमच्या बँक कार्डने सुरक्षितपणे पैसे द्या',
            upi: 'यूपीआय / क्यूआर कोड', upiSub: 'GPay, PhonePe, Paytm, इ.', fast: 'सर्वात जलद',
            scan: 'झटपट पेमेंट करण्यासाठी स्कॅन करा', await: 'पेमेंट पुष्टीकरणाची प्रतीक्षा करत आहे...',
            confirm: 'पेमेंटची पुष्टी करा', process: 'प्रक्रिया करत आहे',
            success: 'पास निश्चित',
            down: 'PDF डाउनलोड करा', myDash: 'माझे डॅशबोर्ड'
        }
    },
    hi: {
        nav: { find: 'पार्किंग खोजें', dash: 'डैशबोर्ड', login: 'लॉग इन', reg: 'रजिस्टर करें', out: 'लॉग आउट' },
        home: { 
            hero: 'अपनी सही पार्किंग जगह खोजें', 
            sub: 'अपने शहर में तुरंत बुक करें।', 
            dest: 'मंजिल', destPh: 'शहर, मॉल, या सड़क...',
            date: 'तारीख', time: 'समय',
            blast: 'अभी खोजें',
            featuresTitle: 'नेक्स्ट-जेन पार्किंग', featuresSub: 'हम हर किसी के लिए पार्किंग आसान बनाते हैं।',
            radar: 'इंस्टेंट रडार', radarDesc: 'अपने गंतव्य के पास सबसे करीब और सबसे सस्ते पार्किंग स्थल तुरंत खोजें।',
            lock: 'सुरक्षित बुकिंग', lockDesc: 'पहले से बुक करें और पहुंचने पर जगह खोजने की चिंता न करें।',
            sync: 'गैराज सिंक', syncDesc: 'कई वाहन सहेजें और बुकिंग करते समय उनके बीच आसानी से स्विच करें।'
        },
        find: {
            title: 'उपलब्ध स्थान', found: 'मिले', filters: 'फ़िल्टर',
            city: 'शहर', allCities: 'सभी शहर', searchPh: 'स्थान के नाम या पते से खोजें...',
            split: 'स्प्लिट व्यू', map: 'नक्शा', list: 'सूची', distance: 'दूरी',
            vehicleType: 'वाहन का प्रकार', car: 'कार', bike: 'बाइक',
            start: 'शुरुआती कीमत', book: 'जगह बुक करें', noSpots: 'कोई पार्किंग जगह नहीं मिली',
            tryDiff: 'उपलब्ध स्थान खोजने के लिए अपना शहर या खोज फ़िल्टर बदलने का प्रयास करें।'
        },
        details: {
            entrance: 'प्रवेश द्वार', free: 'खाली', full: 'भरा हुआ', selected: 'चुना गया',
            date: 'तारीख', start: 'प्रारंभ समय', duration: 'अवधि',
            summary: 'बुकिंग विवरण', slot: 'चुना हुआ स्लॉट', rate: 'दर', total: 'कुल', none: 'कोई नहीं',
            continue: 'बुक करना जारी रखें'
        },
        book: {
            vehicle: 'वाहन संख्या', vehiclePh: 'उदा. MH 12 AB 1234',
            next: 'अगला कदम', back: 'पीछे', secure: 'सुरक्षित चेकआउट',
            totalAmt: 'कुल राशि',
            card: 'क्रेडिट / डेबिट कार्ड', cardSub: 'अपने बैंक कार्ड से सुरक्षित भुगतान करें',
            upi: 'यूपीआई / क्यूआर कोड', upiSub: 'GPay, PhonePe, Paytm, आदि।', fast: 'सबसे तेज़',
            scan: 'तुरंत भुगतान के लिए स्कैन करें', await: 'भुगतान की पुष्टि की प्रतीक्षा में...',
            confirm: 'भुगतान की पुष्टि करें', process: 'प्रसंस्करण',
            success: 'पास कन्फर्म',
            down: 'PDF डाउनलोड करें', myDash: 'मेरा डैशबोर्ड'
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const t = (section) => {
        return translations[lang][section];
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
