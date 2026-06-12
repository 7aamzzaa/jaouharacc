export interface ProductTranslation {
  name: string;
  description: string;
  material: string;
  color: string;
}

export const productTranslations: Record<string, { en: ProductTranslation; fr: ProductTranslation; ar: ProductTranslation }> = {
  "prod-1": {
    en: { name: "ccjaouhara Classic 14k Gold Chain", description: "An elegant, timeless chain link bracelet hand-finished in solid 14k gold. Featuring delicate, interlocking oval loops and an exquisite custom toggle closure, this piece brings a soft gold accent to any wrist.", material: "14k Yellow Gold", color: "Gold" },
    fr: { name: "Chaîne Classique ccjaouhara Or 14k", description: "Un bracelet chaîne élégant et intemporel, fini à la main en or massif 14k. Avec ses maillons ovales délicats entrelacés et sa fermeture à bascule sur mesure, cette pièce apporte une douce touche dorée à chaque poignet.", material: "Or Jaune 14k", color: "Or" },
    ar: { name: "قلادة ccjaouhara الكلاسيكية ذهب 14k", description: "سوار سلسلة أنيق وخالد، مشغول يدويًا من الذهب الخالص عيار 14k. يتميز بحلقات بيضاوية متداخلة رفيعة ومشبك مخصص راقي، يضفي لمسة ذهبية ناعمة على أي معصم.", material: "ذهب أصفر 14k", color: "ذهبي" },
  },
  "prod-9": {
    en: { name: "Aura Solitaire Diamond Hoops", description: "Elegant 18k yellow gold-plated hoop earrings featuring beautiful micro-pave solitaire diamonds. A radiant, high-contrast set bringing timeless sophistication to standard evening attire.", material: "18k Yellow Gold", color: "Gold" },
    fr: { name: "Créoles Aura Solitaire Diamant", description: "Élégantes créoles plaquées or jaune 18k ornées de magnifiques diamants solitaires micropavés. Un ensemble radieux au contraste saisissant qui apporte une sophistication intemporelle aux tenues de soirée.", material: "Or Jaune 18k", color: "Or" },
    ar: { name: "أقراط Aura Solitaire الماسية", description: "أقراط حلقية أنيقة مطليّة بالذهب الأصفر عيار 18k، مرصعة بألماس سوليتير ميكرو بافي رائع. مجموعة مشرقة عالية التباين تضفي لمسة من الأناقة الخالدة على ملابس السهرة.", material: "ذهب أصفر 18k", color: "ذهبي" },
  },
  "prod-11": {
    en: { name: "Seaside Baroque Pearl Anklet", description: "An elegant double-layered ankle chain handcrafted in 14k gold with tiny sparkling baroque dangling pearls. Captures a calm resort mood while reflecting light.", material: "14k Yellow Gold", color: "Gold" },
    fr: { name: "Cheville Baroque Seaside Perle", description: "Un élégant bracelet de cheville à double rangée, fabriqué à la main en or 14k avec de minuscules perles baroques scintillantes. Capture l'esprit serein des stations balnéaires tout en réfléchissant la lumière.", material: "Or Jaune 14k", color: "Or" },
    ar: { name: "خلخال Seaside الباروك باللؤلؤ", description: "خلخال أنيق مزدوج الطبقات مشغول يدويًا من الذهب عيار 14k مع لآلئ باروكية صغيرة متدلية ومتلألئة. يجسد أجواء المنتجع الهادئة بينما يعكس الضوء.", material: "ذهب أصفر 14k", color: "ذهبي" },
  },
  "prod-17": {
    en: { name: "Aura Solitaire Diamond Crown Ring", description: "A breathtaking brilliant-cut 1.5 carat diamond-alternative solitaire set within shimmering micro-pave 18k yellow gold bands. Elegant, timeless, and radiant.", material: "18k Yellow Gold", color: "Gold" },
    fr: { name: "Bague Couronne Aura Solitaire Diamant", description: "Un solitaire à coupe brillante de 1,5 carat alternatif au diamant, à couper le souffle, serti dans des bagues en or jaune 18k micropavées étincelantes. Élégante, intemporelle et rayonnante.", material: "Or Jaune 18k", color: "Or" },
    ar: { name: "خاتم تاج Aura Solitaire الماسي", description: "خاتم سوليتير مذهل مقطوع بريليانت 1.5 قيراط بديل الماس، مرصع داخل أشرطة ذهبية صفراء عيار 18k بميكرو بافي متلألئ. أنيق وخالد ومشرق.", material: "ذهب أصفر 18k", color: "ذهبي" },
  },
  "prod-48": {
    en: { name: "Zahra Moroccan Gold Bridal Set", description: "A gorgeous traditional set. Includes an intricately detailed Moroccan filigree collar and matching statement earrings.", material: "21k Gold Plated Brass", color: "Gold" },
    fr: { name: "Parure de Mariée Zahra Marocaine Or", description: "Un magnifique ensemble traditionnel. Comprend un collier en filigrane marocain richement détaillé et des boucles d'oreilles imposantes assorties.", material: "Laiton Doré à l'Or 21k", color: "Or" },
    ar: { name: "طقم زفاف زهرة المغربي الذهبي", description: "طقم تقليدي رائع. يشمل قلادة مشغولة بالفيليغران المغربي المعقد بتفاصيل دقيقة وأقراط مميزة متناسقة.", material: "نحاس مطلي بالذهب 21k", color: "ذهبي" },
  },
  "prod-49": {
    en: { name: "sansla", description: "good sansla for girls", material: "gold", color: "gold" },
    fr: { name: "Sansla", description: "Belle sansla pour filles", material: "Or", color: "Or" },
    ar: { name: "سنصلة", description: "سنصلة جميلة للبنات", material: "ذهب", color: "ذهبي" },
  },
};
