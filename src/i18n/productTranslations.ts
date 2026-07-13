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
  "prod-50": {
    en: { name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "inoxidable", color: "gold" },
    fr: { name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "inoxidable", color: "Or" },
    ar: { name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "inoxidable", color: "ذهب" },
  },
  "prod-51": {
    en: { name: "Snsla Necklace", description: "Discover the Snsla Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snsla Necklace", description: "Découvrez le collier Snsla, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snsla", description: "اكتشفي قلادة Snsla، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-52": {
    en: { name: "Snasl Db Necklace", description: "Discover the Snasl Db Necklace, a premium stainless steel necklace with an elegant gold finish. Perfect for daily wear and special occasions alike.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snasl Db Necklace", description: "Découvrez le collier Snasl Db, un collier premium en acier inoxydable avec une élégante finition or. Parfait pour le quotidien comme pour les occasions spéciales.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snasl Db", description: "اكتشفي قلادة Snasl Db، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية أنيقة. مثالية للارتداء اليومي والمناسبات الخاصة.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-53": {
    en: { name: "Snasl Sss Necklace", description: "Discover the Snasl Sss Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snasl Sss Necklace", description: "Découvrez le collier Snasl Sss, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snasl Sss", description: "اكتشفي قلادة Snasl Sss، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-54": {
    en: { name: "Bb Snsla Necklace", description: "Discover the Bb Snsla Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bb Snsla Necklace", description: "Découvrez le collier Bb Snsla, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Bb Snsla", description: "اكتشفي قلادة Bb Snsla، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-55": {
    en: { name: "Sensllaa Necklace", description: "Discover the Sensllaa Necklace, a premium stainless steel necklace with a radiant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Sensllaa Necklace", description: "Découvrez le collier Sensllaa, un collier premium en acier inoxydable avec une finition or éclatante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Sensllaa", description: "اكتشفي قلادة Sensllaa، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشرقة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-56": {
    en: { name: "Senslalalaaa Necklace", description: "Discover the Senslalalaaa Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Senslalalaaa Necklace", description: "Découvrez le collier Senslalalaaa, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Senslalalaaa", description: "اكتشفي قلادة Senslalalaaa، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-57": {
    en: { name: "Snasl Necklace", description: "Discover the Snasl Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snasl Necklace", description: "Découvrez le collier Snasl, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snasl", description: "اكتشفي قلادة Snasl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-58": {
    en: { name: "Snslaala Necklace", description: "Discover the Snslaala Necklace, a premium stainless steel necklace with a radiant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snslaala Necklace", description: "Découvrez le collier Snslaala, un collier premium en acier inoxydable avec une finition or éclatante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snslaala", description: "اكتشفي قلادة Snslaala، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشرقة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-59": {
    en: { name: "Smpl Snsla Necklace", description: "Discover the Smpl Snsla Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Smpl Snsla Necklace", description: "Découvrez le collier Smpl Snsla, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Smpl Snsla", description: "اكتشفي قلادة Smpl Snsla، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-60": {
    en: { name: "Snasel Smpl Necklace", description: "Discover the Snasel Smpl Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snasel Smpl Necklace", description: "Découvrez le collier Snasel Smpl, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snasel Smpl", description: "اكتشفي قلادة Snasel Smpl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-61": {
    en: { name: "Senslalala Necklace", description: "Discover the Senslalala Necklace, a premium stainless steel necklace with a radiant gold finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Senslalala Necklace", description: "Découvrez le collier Senslalala, un collier premium en acier inoxydable avec une finition or éclatante. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Senslalala", description: "اكتشفي قلادة Senslalala، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشرقة. مصممة للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-62": {
    en: { name: "Snssl Necklace", description: "Discover the Snssl Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snssl Necklace", description: "Découvrez le collier Snssl, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snssl", description: "اكتشفي قلادة Snssl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-63": {
    en: { name: "Snl Necklace", description: "Discover the Snl Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snl Necklace", description: "Découvrez le collier Snl, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snl", description: "اكتشفي قلادة Snl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-64": {
    en: { name: "Sl Necklace", description: "Discover the Sl Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Sl Necklace", description: "Découvrez le collier Sl, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Sl", description: "اكتشفي قلادة Sl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-65": {
    en: { name: "Snll Necklace", description: "Discover the Snll Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snll Necklace", description: "Découvrez le collier Snll, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snll", description: "اكتشفي قلادة Snll، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-66": {
    en: { name: "Ssssssssnl Necklace", description: "Discover the Ssssssssnl Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Ssssssssnl Necklace", description: "Découvrez le collier Ssssssssnl, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Ssssssssnl", description: "اكتشفي قلادة Ssssssssnl، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-67": {
    en: { name: "Send Necklace", description: "Discover the Send Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Send Necklace", description: "Découvrez le collier Send, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Send", description: "اكتشفي قلادة Send، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-68": {
    en: { name: "Sensll Necklace", description: "Discover the Sensll Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Sensll Necklace", description: "Découvrez le collier Sensll, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Sensll", description: "اكتشفي قلادة Sensll، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-69": {
    en: { name: "Snsla Necklace", description: "Discover the Snsla Necklace, a premium stainless steel necklace with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snsla Necklace", description: "Découvrez le collier Snsla, un collier premium en acier inoxydable avec une superbe finition or. Conçu pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snsla", description: "اكتشفي قلادة Snsla، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصممة للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-70": {
    en: { name: "Snslaaa Necklace", description: "Discover the Snslaaa Necklace, a premium stainless steel necklace with a brilliant gold finish. Designed for women who appreciate timeless beauty and everyday elegance.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Snslaaa Necklace", description: "Découvrez le collier Snslaaa, un collier premium en acier inoxydable avec une finition or brillante. Conçu pour les femmes qui apprécient la beauté intemporelle et l'élégance quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "قلادة Snslaaa", description: "اكتشفي قلادة Snslaaa، قلادة ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصممة للنساء اللواتي يقدرن الجمال الخالد والأناقة اليومية.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
};
