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
  "prod-71": {
    en: { name: "Gold Classic Ring", description: "Discover the Gold Classic Ring, a premium stainless steel ring with a brilliant gold finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Classique Or", description: "Découvrez la Bague Classique Or, une bague premium en acier inoxydable avec une finition or brillante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم كلاسيك ذهبي", description: "اكتشفي الخاتم الكلاسيكي الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-72": {
    en: { name: "Gold Elegance Ring", description: "Discover the Gold Elegance Ring, a premium stainless steel ring with a stunning gold finish. Designed for women who love timeless beauty and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Élégance Or", description: "Découvrez la Bague Élégance Or, une bague premium en acier inoxydable avec une superbe finition or. Conçue pour les femmes qui aiment la beauté intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم أناقة ذهبي", description: "اكتشفي خاتم الأناقة الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصمم للنساء اللواتي يعشقن الجمال الخالد والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-73": {
    en: { name: "Gold Radiance Ring", description: "Discover the Gold Radiance Ring, a premium stainless steel ring with a brilliant gold finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Rayonnante Or", description: "Découvrez la Bague Rayonnante Or, une bague premium en acier inoxydable avec une finition or brillante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم متألق ذهبي", description: "اكتشفي الخاتم المتألق الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-74": {
    en: { name: "Gold Luxe Ring", description: "Discover the Gold Luxe Ring, a premium stainless steel ring with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Luxe Or", description: "Découvrez la Bague Luxe Or, une bague premium en acier inoxydable avec une superbe finition or. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم فاخر ذهبي", description: "اكتشفي الخاتم الفاخر الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-75": {
    en: { name: "Gold Shine Ring", description: "Discover the Gold Shine Ring, a premium stainless steel ring with a radiant gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Éclat Or", description: "Découvrez la Bague Éclat Or, une bague premium en acier inoxydable avec une finition or rayonnante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم بريق ذهبي", description: "اكتشفي خاتم البريق الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشعة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-76": {
    en: { name: "Gold Sparkle Ring", description: "Discover the Gold Sparkle Ring, a premium stainless steel ring with a dazzling gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Scintillante Or", description: "Découvrez la Bague Scintillante Or, une bague premium en acier inoxydable avec une finition or éblouissante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم لامع ذهبي", description: "اكتشفي الخاتم اللامع الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مبهرة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-77": {
    en: { name: "Gold Dream Ring", description: "Discover the Gold Dream Ring, a premium stainless steel ring with a beautiful gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Rêve Or", description: "Découvrez la Bague Rêve Or, une bague premium en acier inoxydable avec une magnifique finition or. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم الحلم الذهبي", description: "اكتشفي خاتم الحلم الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية جميلة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-78": {
    en: { name: "Gold Grace Ring", description: "Discover the Gold Grace Ring, a premium stainless steel ring with an elegant gold finish. Designed for women who love timeless beauty and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Grâce Or", description: "Découvrez la Bague Grâce Or, une bague premium en acier inoxydable avec une finition or élégante. Conçue pour les femmes qui aiment la beauté intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم الرقي الذهبي", description: "اكتشفي خاتم الرقي الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية أنيقة. مصمم للنساء اللواتي يعشقن الجمال الخالد والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-79": {
    en: { name: "Gold Royal Ring", description: "Discover the Gold Royal Ring, a premium stainless steel ring with a regal gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Royale Or", description: "Découvrez la Bague Royale Or, une bague premium en acier inoxydable avec une finition or royale. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم ملكي ذهبي", description: "اكتشفي الخاتم الملكي الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية ملكية. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-80": {
    en: { name: "Gold Bliss Ring", description: "Discover the Gold Bliss Ring, a premium stainless steel ring with a radiant gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Bonheur Or", description: "Découvrez la Bague Bonheur Or, une bague premium en acier inoxydable avec une finition or rayonnante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم السعادة الذهبي", description: "اكتشفي خاتم السعادة الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشعة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-81": {
    en: { name: "Gold Pure Ring", description: "Discover the Gold Pure Ring, a premium stainless steel ring with a brilliant gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Pure Or", description: "Découvrez la Bague Pure Or, une bague premium en acier inoxydable avec une finition or brillante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم نقي ذهبي", description: "اكتشفي الخاتم النقي الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-82": {
    en: { name: "Gold Glory Ring", description: "Discover the Gold Glory Ring, a premium stainless steel ring with a stunning gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Gloire Or", description: "Découvrez la Bague Gloire Or, une bague premium en acier inoxydable avec une superbe finition or. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم المجد الذهبي", description: "اكتشفي خاتم المجد الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مذهلة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-83": {
    en: { name: "Gold Jewel Ring", description: "Discover the Gold Jewel Ring, a premium stainless steel ring with a brilliant gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Joyau Or", description: "Découvrez la Bague Joyau Or, une bague premium en acier inoxydable avec une finition or brillante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم الجوهرة الذهبي", description: "اكتشفي خاتم الجوهرة الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية لامعة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-84": {
    en: { name: "Gold Charm Ring", description: "Discover the Gold Charm Ring, a premium stainless steel ring with a captivating gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Charme Or", description: "Découvrez la Bague Charme Or, une bague premium en acier inoxydable avec une finition or captivante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم ساحر ذهبي", description: "اكتشفي الخاتم الساحر الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية آسرة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-85": {
    en: { name: "Gold Muse Ring", description: "Discover the Gold Muse Ring, a premium stainless steel ring with a refined gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Muse Or", description: "Découvrez la Bague Muse Or, une bague premium en acier inoxydable avec une finition or raffinée. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم ملهم ذهبي", description: "اكتشفي الخاتم الملهم الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية راقية. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-86": {
    en: { name: "Gold Diva Ring", description: "Discover the Gold Diva Ring, a premium stainless steel ring with a glamorous gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Diva Or", description: "Découvrez la Bague Diva Or, une bague premium en acier inoxydable avec une finition or glamour. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم ديفا ذهبي", description: "اكتشفي خاتم ديفا الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية فاتنة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-87": {
    en: { name: "Gold Crown Ring", description: "Discover the Gold Crown Ring, a premium stainless steel ring with a majestic gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Couronne Or", description: "Découvrez la Bague Couronne Or, une bague premium en acier inoxydable avec une finition or majestueuse. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم التاج الذهبي", description: "اكتشفي خاتم التاج الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مهيبة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-88": {
    en: { name: "Gold Star Ring", description: "Discover the Gold Star Ring, a premium stainless steel ring with a luminous gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Étoile Or", description: "Découvrez la Bague Étoile Or, une bague premium en acier inoxydable avec une finition or lumineuse. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم النجمة الذهبي", description: "اكتشفي خاتم النجمة الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية متألقة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-89": {
    en: { name: "Gold Angel Ring", description: "Discover the Gold Angel Ring, a premium stainless steel ring with a divine gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Ange Or", description: "Découvrez la Bague Ange Or, une bague premium en acier inoxydable avec une finition or divine. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم الملاك الذهبي", description: "اكتشفي خاتم الملاك الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية سماوية. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-90": {
    en: { name: "Gold Princess Ring", description: "Discover the Gold Princess Ring, a premium stainless steel ring with a charming gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Princesse Or", description: "Découvrez la Bague Princesse Or, une bague premium en acier inoxydable avec une finition or charmante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم الأميرة الذهبي", description: "اكتشفي خاتم الأميرة الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية ساحرة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
  "prod-91": {
    en: { name: "Gold Destiny Ring", description: "Discover the Gold Destiny Ring, a premium stainless steel ring with a radiant gold finish. Designed for women who love timeless elegance and everyday sophistication.", material: "Premium Stainless Steel", color: "gold" },
    fr: { name: "Bague Destin Or", description: "Découvrez la Bague Destin Or, une bague premium en acier inoxydable avec une finition or rayonnante. Conçue pour les femmes qui aiment l'élégance intemporelle et la sophistication quotidienne.", material: "Acier Inoxydable Premium", color: "Or" },
    ar: { name: "خاتم القدر الذهبي", description: "اكتشفي خاتم القدر الذهبي، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية ذهبية مشعة. مصمم للنساء اللواتي يعشقن الأناقة الخالدة والرقي اليومي.", material: "فولاذ مقاوم للصدأ ممتاز", color: "ذهبي" },
  },
};
