export interface BlogTranslation {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

export const blogTranslations: Record<string, { en: BlogTranslation; fr: BlogTranslation; ar: BlogTranslation }> = {
  "2026-jewelry-trends": {
    en: {
      title: "2026 Jewelry Trends: What's In This Season",
      excerpt: "From sculptural gold to nature-inspired motifs, discover the defining jewelry trends shaping elegance this year.",
      content: `<p>The world of fine jewelry is constantly evolving, and 2026 brings a refreshing blend of bold statements and delicate craftsmanship. This season, we're seeing a shift toward pieces that tell a story — each curve, texture, and gemstone chosen with intention.</p>
<p>Sculptural gold takes center stage, with fluid, organic shapes that mimic the movement of water and wind. Designers are moving away from rigid symmetry, embracing asymmetrical forms that feel both modern and timeless.</p>
<p>Nature-inspired motifs continue to captivate, with leaves, vines, and floral patterns rendered in precious metals. The trend extends beyond mere aesthetics — it reflects a deeper connection to the natural world and sustainable luxury.</p>
<p>Layered necklaces remain a staple, but the approach has evolved. Mixed lengths, varied textures, and the interplay of gold and silver create a curated, personal look. The key is balance — let one piece lead while others complement.</p>
<p>Earrings are growing bolder. Statement hoops, sculptural drops, and architectural studs frame the face with confidence. The bigger, the better — but always with an air of refinement.</p>
<p>As we move through the year, expect to see more personalized pieces, custom engravings, and modular designs that adapt to every occasion. Jewelry is no longer just an accessory — it's an extension of identity.</p>`,
      category: "Jewelry Trends",
      tags: ['trends', 'gold', 'design', '2026'],
    },
    fr: {
      title: "Tendances Bijouterie 2026 : Ce Qui Est In Cette Saison",
      excerpt: "De l'or sculptural aux motifs inspirés de la nature, découvrez les tendances bijouterie qui redéfinissent l'élégance cette année.",
      content: `<p>Le monde de la bijouterie fine évolue constamment, et 2026 apporte un mélange rafraîchissant de déclarations audacieuses et de savoir-faire délicat. Cette saison, nous assistons à un mouvement vers des pièces qui racontent une histoire — chaque courbe, texture et pierre précieuse choisie avec intention.</p>
<p>L'or sculptural occupe le devant de la scène, avec des formes fluides et organiques qui imitent le mouvement de l'eau et du vent. Les créateurs s'éloignent de la symétrie rigide pour adopter des formes asymétriques à la fois modernes et intemporelles.</p>
<p>Les motifs inspirés de la nature continuent de captiver, avec des feuilles, des vignes et des motifs floraux rendus en métaux précieux. La tendance va au-delà de la simple esthétique — elle reflète une connexion plus profonde avec le monde naturel et le luxe durable.</p>
<p>Les colliers superposés restent un incontournable, mais l'approche a évolué. Des longueurs variées, des textures diverses et l'interaction de l'or et de l'argent créent un look curatoriel et personnel. La clé est l'équilibre — laissez une pièce mener tandis que les autres complètent.</p>
<p>Les boucles d'oreilles deviennent plus audacieuses. Les créoles statement, les gouttes sculpturales et les puces architecturales encadrent le visage avec confiance. Plus c'est grand, mieux c'est — mais toujours avec une touche de raffinement.</p>
<p>Tout au long de l'année, attendez-vous à voir plus de pièces personnalisées, de gravures sur mesure et de designs modulaires qui s'adaptent à chaque occasion. La bijouterie n'est plus un simple accessoire — c'est une extension de l'identité.</p>`,
      category: "Tendances Bijouterie",
      tags: ['trends', 'gold', 'design', '2026'],
    },
    ar: {
      title: "اتجاهات المجوهرات 2026: ما هو رائج هذا الموسم",
      excerpt: "من الذهب النحتي إلى الزخارف المستوحاة من الطبيعة، اكتشف اتجاهات المجوهرات المحددة التي تشكل الأناقة هذا العام.",
      content: `<p>عالم المجوهرات الفاخرة في تطور مستمر، ويجلب عام 2026 مزيجاً منعشاً من التصريحات الجريئة والحرفية الدقيقة. هذا الموسم، نشهد تحولاً نحو القطع التي تروي قصة — كل منحنى وملمس وحجر كريم مختار بقصد.</p>
<p>الذهب النحتي يأخذ مركز الصدارة، بأشكال سلسة وعضوية تحاكي حركة الماء والرياح. المصممون يبتعدون عن التماثل الجامد، ويتبنون أشكالاً غير متماثلة تبدو حديثة وخالدة في آن واحد.</p>
<p>الزخارف المستوحاة من الطبيعة تواصل جذب الانتباه، بأوراق الشجر والكروم والأنماط الزهرية المصنوعة من المعادن الثمينة. هذه الاتجاهات تتجاوز مجرد الجماليات — إنها تعكس ارتباطاً أعمق بالعالم الطبيعي والفخامة المستدامة.</p>
<p>القلائد المتعددة الطبقات تبقى أساسية، لكن النهج تطور. الأطوال المختلطة، والأنسجة المتنوعة، والتفاعل بين الذهب والفضة يخلق مظهراً منسقاً وشخصياً. المفتاح هو التوازن — دع قطعة واحدة تقود بينما تكملها الأخريات.</p>
<p>الأقراط أصبحت أكثر جرأة. الأقراط الحلقية الجريئة، والقطرات النحتية، والأقراط المعمارية تؤطر الوجه بثقة. كلما كانت أكبر، كان أفضل — ولكن دائماً بلمسة من الرقي.</p>
<p>مع تقدمنا خلال العام، توقعوا رؤية المزيد من القطع الشخصية، والنقوش المخصصة، والتصاميم المعيارية التي تتكيف مع كل مناسبة. المجوهرات لم تعد مجرد إكسسوار — بل امتداد للهوية.</p>`,
      category: "اتجاهات المجوهرات",
      tags: ['trends', 'gold', 'design', '2026'],
    },
  },
  "sustainable-luxury-jewelry": {
    en: {
      title: "The Rise of Sustainable Luxury Jewelry",
      excerpt: "Why modern consumers are choosing ethically sourced materials and artisanal craftsmanship over mass production.",
      content: `<p>Sustainability is no longer a niche concern — it's a defining value for today's discerning jewelry buyer. The modern consumer wants to know where their pieces come from, who made them, and what impact they have on the world.</p>
<p>At ccjaouhara, we've always believed that true luxury is rooted in responsibility. Our pieces are crafted using ethically sourced materials, with a commitment to minimizing environmental impact while maximizing beauty and durability.</p>
<p>The shift toward sustainable luxury is driven by a desire for meaning. A piece of jewelry is more than an ornament — it's a keepsake, a story, a legacy. Knowing that it was created with care for both people and the planet adds immeasurable value.</p>
<p>Artisanal craftsmanship is experiencing a renaissance. Consumers are gravitating toward hand-finished pieces that bear the mark of their maker, moving away from impersonal mass production. Each imperfection tells a story of human hands at work.</p>
<p>Recycled metals, lab-grown gemstones, and responsible sourcing are becoming the new standard. The industry is evolving, and we're proud to be part of that transformation — creating jewelry that's as ethical as it is exquisite.</p>`,
      category: "Jewelry Trends",
      tags: ['sustainability', 'ethical', 'craftsmanship', 'luxury'],
    },
    fr: {
      title: "L'Essor de la Bijouterie de Luxe Durable",
      excerpt: "Pourquoi les consommateurs modernes choisissent des matériaux éthiques et un savoir-faire artisanal plutôt que la production de masse.",
      content: `<p>Le développement durable n'est plus une préoccupation de niche — c'est une valeur fondamentale pour l'acheteur de bijoux exigeant d'aujourd'hui. Le consommateur moderne veut savoir d'où viennent ses pièces, qui les a fabriquées et quel impact elles ont sur le monde.</p>
<p>Chez ccjaouhara, nous avons toujours cru que le vrai luxe est ancré dans la responsabilité. Nos pièces sont fabriquées avec des matériaux éthiques, avec un engagement à minimiser l'impact environnemental tout en maximisant la beauté et la durabilité.</p>
<p>L'évolution vers le luxe durable est motivée par une recherche de sens. Un bijou est plus qu'un ornement — c'est un souvenir, une histoire, un héritage. Savoir qu'il a été créé avec soin pour les personnes et la planète ajoute une valeur inestimable.</p>
<p>Le savoir-faire artisanal connaît une renaissance. Les consommateurs se tournent vers des pièces finies à la main qui portent la marque de leur créateur, s'éloignant de la production de masse impersonnelle. Chaque imperfection raconte l'histoire de mains humaines au travail.</p>
<p>Les métaux recyclés, les pierres précieuses cultivées en laboratoire et l'approvisionnement responsable deviennent la nouvelle norme. L'industrie évolue, et nous sommes fiers de faire partie de cette transformation — créant des bijoux aussi éthiques qu'exquis.</p>`,
      category: "Tendances Bijouterie",
      tags: ['sustainability', 'ethical', 'craftsmanship', 'luxury'],
    },
    ar: {
      title: "صعود المجوهرات الفاخرة المستدامة",
      excerpt: "لماذا يختار المستهلكون المعاصرون المواد الأخلاقية والحرفية اليدوية بدلاً من الإنتاج الضخم.",
      content: `<p>الاستدامة لم تعد مصدر قلق متخصص — بل هي قيمة أساسية لمشتري المجوهرات المميز اليوم. المستهلك الحديث يريد أن يعرف من أين تأتي قطعه، ومن صنعها، وما تأثيرها على العالم.</p>
<p>في ccjaouhara، آمنا دائماً أن الفخامة الحقيقية متجذرة في المسؤولية. قطعنا مصنوعة من مواد أخلاقية، مع الالتزام بتقليل الأثر البيئي مع تعظيم الجمال والمتانة.</p>
<p>التحول نحو الفخامة المستدامة مدفوع بالرغبة في المعنى. قطعة المجوهرات هي أكثر من مجرد زينة — إنها تذكار، وقصة، وإرث. معرفة أنها صُنعت بعناية لكل من الناس والكوكب يضيف قيمة لا تُقدر.</p>
<p>الحرفية اليدوية تشهد نهضة. المستهلكون يتجهون نحو القطع المصقولة يدوياً التي تحمل بصمة صانعها، مبتعدين عن الإنتاج الضخم غير الشخصي. كل عيب صغير يحكي قصة أيادٍ بشرية تعمل.</p>
<p>المعادن المعاد تدويرها، والأحجار الكريمة المزروعة في المختبر، والتوريد المسؤول أصبحت المعيار الجديد. الصناعة تتطور، ونحن فخورون بأن نكون جزءاً من هذا التحول — نصنع مجوهرات أخلاقية بقدر ما هي رائعة.</p>`,
      category: "اتجاهات المجوهرات",
      tags: ['sustainability', 'ethical', 'craftsmanship', 'luxury'],
    },
  },
  "how-to-layer-necklaces": {
    en: {
      title: "How to Layer Necklaces Like a Stylist",
      excerpt: "Master the art of necklace layering with our expert guide — from chain lengths to pendant placement.",
      content: `<p>Necklace layering is one of the most elegant ways to elevate any outfit. When done right, it creates a harmonious composition that draws the eye and adds depth to your look. But mastering the art requires a bit of know-how.</p>
<p><strong>Start with a focal point.</strong> Choose one pendant or statement piece as the anchor of your arrangement. This could be a solitaire diamond drop, a pearl medallion, or a personalized initial. Build your layers around it.</p>
<p><strong>Vary your chain lengths.</strong> The golden rule is to keep at least 5cm (2 inches) between each layer. A typical arrangement might include a 40cm choker, a 45cm princess length, and a 50cm matinee chain. This prevents tangling and creates visual interest.</p>
<p><strong>Mix textures and metals.</strong> Don't be afraid to combine different chain styles — a delicate cable chain, a chunky figaro, and a beaded strand can coexist beautifully. Similarly, mixing yellow gold, rose gold, and silver adds dimension when done with intention.</p>
<p><strong>Consider your neckline.</strong> The shape of your collar determines which layering strategy works best. V-necks pair well with graduated layers, while crew necks call for longer chains that fall below the collarbone.</p>
<p>Remember: confidence is your best accessory. Experiment, trust your eye, and wear what makes you feel radiant.</p>`,
      category: "Fashion Tips",
      tags: ['styling', 'necklaces', 'layering', 'fashion'],
    },
    fr: {
      title: "Comment Superposer les Colliers Comme une Styliste",
      excerpt: "Maîtrisez l'art de la superposition de colliers avec notre guide expert — des longueurs de chaîne au placement des pendentifs.",
      content: `<p>La superposition de colliers est l'un des moyens les plus élégants de rehausser n'importe quelle tenue. Bien réalisée, elle crée une composition harmonieuse qui attire le regard et ajoute de la profondeur à votre look. Mais maîtriser cet art demande un peu de savoir-faire.</p>
<p><strong>Commencez par un point focal.</strong> Choisissez un pendentif ou une pièce forte comme point d'ancrage de votre arrangement. Cela peut être une goutte de diamant solitaire, un médaillon en perle ou une initiale personnalisée. Construisez vos couches autour de lui.</p>
<p><strong>Variez les longueurs de chaîne.</strong> La règle d'or est de garder au moins 5 cm entre chaque couche. Un arrangement typique pourrait inclure un collier ras-du-cou de 40 cm, une longueur princesse de 45 cm et une chaîne matinée de 50 cm. Cela évite les enchevêtrements et crée un intérêt visuel.</p>
<p><strong>Mélangez textures et métaux.</strong> N'ayez pas peur de combiner différents styles de chaînes — une chaîne cable délicate, une figaro épaisse et un rang de perles peuvent coexister magnifiquement. De même, mélanger l'or jaune, l'or rose et l'argent ajoute de la dimension quand c'est fait avec intention.</p>
<p><strong>Tenez compte de votre décolleté.</strong> La forme de votre encolure détermine la stratégie de superposition la plus adaptée. Les décolletés en V s'accordent bien avec des couches graduées, tandis que les cols ronds nécessitent des chaînes plus longues qui tombent sous la clavicule.</p>
<p>Souvenez-vous : la confiance est votre meilleur accessoire. Expérimentez, faites confiance à votre œil, et portez ce qui vous fait rayonner.</p>`,
      category: "Conseils Mode",
      tags: ['styling', 'necklaces', 'layering', 'fashion'],
    },
    ar: {
      title: "كيفية تنسيق القلائد المتعددة الطبقات مثل خبيرة ستايل",
      excerpt: "أتقن فن تنسيق القلائد المتعددة الطبقات مع دليل خبرائنا — من أطوال السلاسل إلى وضع القلادة.",
      content: `<p>تنسيق القلائد المتعددة الطبقات هو أحد أكثر الطرق أناقة لرفع أي إطلالة. عندما يتم بشكل صحيح، فإنه يخلق تركيبة متناغمة تجذب العين وتضيف عمقاً لمظهرك. لكن إتقان هذا الفن يتطلب بعض المعرفة.</p>
<p><strong>ابدأ بنقطة محورية.</strong> اختر قلادة أو قطعة مميزة كمرساة لترتيبك. يمكن أن تكون هذا قطرة ماسية منفردة، أو ميدالية لؤلؤية، أو حرف أول مخصص. ابنِ طبقاتك حولها.</p>
<p><strong>نوّع أطوال سلاسلك.</strong> القاعدة الذهبية هي الحفاظ على 5 سم على الأقل بين كل طبقة. الترتيب النموذجي قد يشمل قلادة بطول 40 سم، وقلادة بطول 45 سم (بريincess)، وسلسلة بطول 50 سم. هذا يمنع التشابك ويخلق اهتماماً بصرياً.</p>
<p><strong>امزج بين الأنسجة والمعادن.</strong> لا تخف من الجمع بين أنماط مختلفة من السلاسل — سلسلة كابل دقيقة، وفيغارو ثقيل، وخيط خرز يمكن أن تتناسق بشكل جميل. وبالمثل، مزج الذهب الأصفر والذهب الوردي والفضة يضيف أبعاداً عندما يتم بقصد.</p>
<p><strong>ضع في اعتبارك خط العنق.</strong> شكل ياقة ملابسك يحدد استراتيجية التنسيق الأفضل. خطوط العنق على شكل V تتناسب جيداً مع الطبقات المتدرجة، بينما الياقات المستديرة تتطلب سلاسل أطول تقع أسفل عظمة الترقوة.</p>
<p>تذكر: الثقة هي أفضل إكسسوار لك. جرب، وثق بعينك، وارتدِ ما يجعلك تشعرين بالإشراق.</p>`,
      category: "نصائح موضة",
      tags: ['styling', 'necklaces', 'layering', 'fashion'],
    },
  },
  "mixing-metals-guide": {
    en: {
      title: "Mixing Metals: The Modern Guide",
      excerpt: "Gone are the days of committing to one metal. Learn how to confidently mix gold, silver, and rose gold.",
      content: `<p>For decades, fashion rules dictated that gold and silver should never mix. Thankfully, those days are behind us. Today's most stylish looks embrace the art of metal mixing, creating dynamic, personalized combinations that express individuality.</p>
<p><strong>Find your unifying element.</strong> The secret to successful metal mixing is a common thread. This could be a shared gemstone color, a consistent texture, or a similar design language. When each piece has something in common with the others, the combination feels intentional rather than accidental.</p>
<p><strong>Use one metal as your base.</strong> Choose a dominant metal for the majority of your pieces, then introduce accents in a contrasting tone. For example, wear mostly yellow gold with one or two silver pieces as highlights.</p>
<p><strong>Consider your skin tone.</strong> While personal preference always comes first, certain metals complement different complexions. Warm skin tones glow with yellow and rose gold, while cool skin tones shine with white gold and silver. But rules are made to be broken — confidence trumps everything.</p>
<p><strong>Stack strategically.</strong> If you're wearing multiple rings, bracelets, or necklaces, distribute the metals evenly. A balanced composition prevents any single colour from overwhelming the arrangement.</p>
<p>The modern approach to jewelry is personal, expressive, and free from outdated conventions. Mix, match, and make it yours.</p>`,
      category: "Fashion Tips",
      tags: ['styling', 'metals', 'gold', 'silver', 'fashion'],
    },
    fr: {
      title: "Mélanger les Métaux : Le Guide Moderne",
      excerpt: "Fini le temps où il fallait choisir un seul métal. Apprenez à mélanger l'or, l'argent et l'or rose avec confiance.",
      content: `<p>Pendant des décennies, les règles de la mode dictaient que l'or et l'argent ne devaient jamais se mélanger. Heureusement, cette époque est révolue. Les looks les plus stylés d'aujourd'hui embrassent l'art du mélange des métaux, créant des combinaisons dynamiques et personnalisées qui expriment l'individualité.</p>
<p><strong>Trouvez votre élément unificateur.</strong> Le secret d'un mélange réussi de métaux est un fil conducteur commun. Cela peut être une couleur de pierre précieuse partagée, une texture cohérente ou un langage de design similaire. Quand chaque pièce a quelque chose en commun avec les autres, la combinaison semble intentionnelle plutôt qu'accidentelle.</p>
<p><strong>Utilisez un métal comme base.</strong> Choisissez un métal dominant pour la majorité de vos pièces, puis introduisez des accents dans un ton contrastant. Par exemple, portez principalement de l'or jaune avec une ou deux pièces en argent comme accents.</p>
<p><strong>Tenez compte de votre carnation.</strong> Bien que la préférence personnelle prime toujours, certains métaux complètent différentes carnations. Les teints chauds rayonnent avec l'or jaune et l'or rose, tandis que les teints froids brillent avec l'or blanc et l'argent. Mais les règles sont faites pour être brisées — la confiance prime sur tout.</p>
<p><strong>Superposez stratégiquement.</strong> Si vous portez plusieurs bagues, bracelets ou colliers, répartissez les métaux uniformément. Une composition équilibrée empêche une seule couleur de dominer l'arrangement.</p>
<p>L'approche moderne de la bijouterie est personnelle, expressive et libérée des conventions dépassées. Mélangez, assortissez et faites-en votre signature.</p>`,
      category: "Conseils Mode",
      tags: ['styling', 'metals', 'gold', 'silver', 'fashion'],
    },
    ar: {
      title: "مزج المعادن: الدليل العصري",
      excerpt: "لقد ولت أيام الالتزام بمعدن واحد. تعلم كيف تمزج الذهب والفضة والذهب الوردي بثقة.",
      content: `<p>لعقود، فرضت قواعد الموضة أن الذهب والفضة لا يجب أن يختلطا أبداً. لحسن الحظ، تلك الأيام ولت. أجمل الإطلالات اليوم تحتضن فن مزج المعادن، وتخلق تركيبات ديناميكية وشخصية تعبر عن الفردية.</p>
<p><strong>ابحث عن عنصر التوحيد الخاص بك.</strong> سر نجاح مزج المعادن هو خيط مشترك. يمكن أن يكون هذا لون حجر كريم مشترك، أو ملمساً متناسقاً، أو لغة تصميم متشابهة. عندما يكون لكل قطعة شيء مشترك مع الأخريات، تبدو التركيبة مقصودة وليست عشوائية.</p>
<p><strong>استخدم معدناً واحداً كقاعدة.</strong> اختر معدناً سائداً لغالبية قطعك، ثم أضف لمسات متباينة. على سبيل المثال، ارتدي الذهب الأصفر في الغالب مع قطعة أو اثنتين من الفضة كلمسات بارزة.</p>
<p><strong>ضع في اعتبارك لون بشرتك.</strong> بينما التفضيل الشخصي يأتي أولاً دائماً، بعض المعادن تكمل ألوان البشرة المختلفة. البشرة الدافئة تتألق بالذهب الأصفر والوردي، بينما البشرة الباردة تلمع بالذهب الأبيض والفضة. لكن القواعد وجدت لتكسر — الثقة تتغلب على كل شيء.</p>
<p><strong>نسّق بإستراتيجية.</strong> إذا كنت ترتدين خواتم أو أساور أو قلائد متعددة، وزعي المعادن بالتساوي. التركيبة المتوازنة تمنع أي لون من الهيمنة على الترتيب.</p>
<p>النهج الحديث في المجوهرات شخصي، معبر، وخالٍ من التقاليد البالية. امزجي ونسقي واجعليه أسلوبك الخاص.</p>`,
      category: "نصائح موضة",
      tags: ['styling', 'metals', 'gold', 'silver', 'fashion'],
    },
  },
  "jewelry-gift-guide": {
    en: {
      title: "The Ultimate Jewelry Gift Guide for Every Occasion",
      excerpt: "From birthdays to anniversaries, find the perfect piece for every special moment in her life.",
      content: `<p>Choosing the perfect jewelry gift is an art. Whether you're celebrating a milestone or simply showing appreciation, the right piece speaks volumes. Here's our guide to selecting jewelry that will be treasured forever.</p>
<p><strong>For birthdays,</strong> consider birthstone jewelry. A pendant or ring featuring her birth gemstone adds a personal touch that shows thought and care. Each stone carries its own symbolism, making the gift deeply meaningful.</p>
<p><strong>Anniversaries call for timeless pieces.</strong> Diamond studs, a classic tennis bracelet, or a solitaire pendant are investments in elegance that will be worn for decades. These are pieces that become heirlooms.</p>
<p><strong>For engagements and weddings,</strong> the ring is just the beginning. Consider matching earrings or a delicate necklace that complements the bridal look. Many brides appreciate a gift that marks both the occasion and the beginning of a new chapter.</p>
<p><strong>Graduations and achievements</strong> deserve symbols of accomplishment. A signet ring, a personalized charm bracelet, or a watch with an engraved message marks the milestone with lasting significance.</p>
<p><strong>Just-because gifts</strong> are often the most cherished. A simple pair of hoops, a dainty ring, or a layered necklace says "I was thinking of you" in the most elegant way possible.</p>
<p>Whatever the occasion, remember: the best jewelry gift is one that reflects her style, not yours. Observe what she already wears, and choose something that will complement her collection.</p>`,
      category: "Gift Ideas",
      tags: ['gift guide', 'occasions', 'birthday', 'anniversary', 'wedding'],
    },
    fr: {
      title: "Le Guide Ultime des Cadeaux Bijoux pour Chaque Occasion",
      excerpt: "Des anniversaires aux fiançailles, trouvez la pièce parfaite pour chaque moment spécial de sa vie.",
      content: `<p>Choisir le cadeau bijou parfait est un art. Que vous célébriez un événement marquant ou que vous montriez simplement votre appréciation, la bonne pièce en dit long. Voici notre guide pour sélectionner des bijoux qui seront chéris pour toujours.</p>
<p><strong>Pour les anniversaires,</strong> pensez aux bijoux de pierre de naissance. Un pendentif ou une bague avec sa pierre de naissance ajoute une touche personnelle qui montre attention et soin. Chaque pierre porte son propre symbolisme, rendant le cadeau profondément significatif.</p>
<p><strong>Les anniversaires de mariage méritent des pièces intemporelles.</strong> Des puces en diamant, un bracelet tennis classique ou un pendentif solitaire sont des investissements en élégance qui seront portés pendant des décennies. Ce sont des pièces qui deviennent des héritages.</p>
<p><strong>Pour les fiançailles et les mariages,</strong> la bague n'est que le début. Considérez des boucles d'oreilles assorties ou un collier délicat qui complète le look de la mariée. De nombreuses mariées apprécient un cadeau qui marque à la fois l'occasion et le début d'un nouveau chapitre.</p>
<p><strong>Les remises de diplômes et les réussites</strong> méritent des symboles d'accomplissement. Une chevalière, un bracelet à charms personnalisé ou une montre avec un message gravé marque l'étape avec une signification durable.</p>
<p><strong>Les cadeaux sans raison particulière</strong> sont souvent les plus appréciés. Une simple paire de créoles, une bague délicate ou un collier superposé dit « Je pensais à toi » de la manière la plus élégante possible.</p>
<p>Quelle que soit l'occasion, souvenez-vous : le meilleur cadeau bijou est celui qui reflète son style, pas le vôtre. Observez ce qu'elle porte déjà et choisissez quelque chose qui complétera sa collection.</p>`,
      category: "Idées Cadeaux",
      tags: ['gift guide', 'occasions', 'birthday', 'anniversary', 'wedding'],
    },
    ar: {
      title: "الدليل الشامل لهدايا المجوهرات لكل مناسبة",
      excerpt: "من أعياد الميلاد إلى الذكرى السنوية، ابحث عن القطعة المثالية لكل لحظة مميزة في حياتها.",
      content: `<p>اختيار هدية المجوهرات المثالية هو فن. سواء كنت تحتفل بمناسبة مهمة أو تظهر تقديرك ببساطة، القطعة المناسبة تقول الكثير. إليك دليلنا لاختيار مجوهرات ستظل ثمينة إلى الأبد.</p>
<p><strong>لأعياد الميلاد،</strong> فكر في مجوهرات حجر الميلاد. قلادة أو خاتم بحجر ميلادها يضيف لمسة شخصية تظهر الاهتمام والرعاية. كل حجر يحمل رمزيته الخاصة، مما يجعل الهدية ذات معنى عميق.</p>
<p><strong>الذكرى السنوية تستدعي قطعاً خالدة.</strong> أقراط ماسية صغيرة، أو سوار تنس كلاسيكي، أو قلادة منفردة هي استثمارات في الأناقة سترتدى لعقود. هذه هي القطع التي تصبح إرثاً عائلياً.</p>
<p><strong>للخطوبة والزواج،</strong> الخاتم هو مجرد البداية. فكري في أقراط متطابقة أو قلادة رقيقة تكمل إطلالة العروس. العديد من العرائس يقدرن هدية تمثل المناسبة وبداية فصل جديد.</p>
<p><strong>التخرج والإنجازات</strong> تستحق رموزاً للإنجاز. خاتم بختم، أو سوار تعويذة شخصي، أو ساعة برسالة محفورة يمثل المحطة بأهمية دائمة.</p>
<p><strong>هدايا بدون مناسبة</strong> غالباً ما تكون الأكثر تقديراً. زوج بسيط من الأقراط الحلقية، أو خاتم أنيق، أو قلادة متعددة الطبقات تقول «كنت أفكر فيك» بأكثر طريقة أنيقة ممكنة.</p>
<p>مهما كانت المناسبة، تذكر: أفضل هدية مجوهرات هي تلك التي تعكس أسلوبها، ليس أسلوبك. لاحظي ما ترتديه بالفعل، واختاري شيئاً يكمل مجموعتها.</p>`,
      category: "أفكار هدايا",
      tags: ['gift guide', 'occasions', 'birthday', 'anniversary', 'wedding'],
    },
  },
  "birthstone-jewelry-guide": {
    en: {
      title: "Birthstone Jewelry: A Personalised Touch",
      excerpt: "Discover the meaning behind each birthstone and how to incorporate them into your everyday style.",
      content: `<p>Birthstone jewelry has been cherished for centuries, believed to bring luck, protection, and healing to the wearer. Today, these gemstones are celebrated not just for their symbolism, but for their stunning beauty and versatility in modern design.</p>
<p><strong>January — Garnet:</strong> Deep red and intensely vibrant, garnet symbolizes friendship and trust. It pairs beautifully with both gold and silver settings.</p>
<p><strong>February — Amethyst:</strong> This regal purple stone represents peace and clarity. Its cool tones are striking against rose gold.</p>
<p><strong>March — Aquamarine:</strong> The pale blue of the sea, aquamarine embodies serenity and courage. It's especially stunning in minimalist bezel settings.</p>
<p><strong>April — Diamond:</strong> The ultimate symbol of enduring love, diamonds need no introduction. They complement every metal and every style.</p>
<p><strong>May — Emerald:</strong> Rich green emeralds symbolize rebirth and prosperity. They command attention in both vintage and contemporary designs.</p>
<p><strong>June — Pearl:</strong> Classic, luminous, and eternally elegant. Pearls represent purity and wisdom, perfect for both bridal and everyday wear.</p>
<p><strong>July — Ruby:</strong> The king of gemstones, ruby's fiery red represents passion and vitality. A ruby pendant or ring makes an unforgettable statement.</p>
<p><strong>August — Peridot:</strong> Bright lime-green peridot symbolizes strength and healing. Its cheerful hue adds a pop of colour to any jewellery box.</p>
<p><strong>September — Sapphire:</strong> Deep blue sapphires represent wisdom and nobility. They're a sophisticated choice for any occasion.</p>
<p><strong>October — Opal:</strong> With its mesmerizing play of colour, opal symbolizes creativity and inspiration. Each stone is entirely unique.</p>
<p><strong>November — Citrine:</strong> Warm golden citrine radiates joy and abundance. It's a sunny addition to any collection.</p>
<p><strong>December — Turquoise:</strong> This ancient stone represents protection and good fortune. Its distinctive blue-green hue is instantly recognizable.</p>
<p>Whether worn as a solo statement or stacked with other pieces, birthstone jewelry adds a deeply personal dimension to your style.</p>`,
      category: "Gift Ideas",
      tags: ['birthstone', 'gemstones', 'personalized', 'guide'],
    },
    fr: {
      title: "Bijoux de Pierre de Naissance : Une Touche Personnalisée",
      excerpt: "Découvrez la signification de chaque pierre de naissance et comment les intégrer à votre style quotidien.",
      content: `<p>Les bijoux de pierre de naissance sont chéris depuis des siècles, censés apporter chance, protection et guérison à celui qui les porte. Aujourd'hui, ces pierres précieuses sont célébrées non seulement pour leur symbolisme, mais aussi pour leur beauté époustouflante et leur polyvalence dans le design moderne.</p>
<p><strong>Janvier — Grenat :</strong> D'un rouge profond et intensément vibrant, le grenat symbolise l'amitié et la confiance. Il s'accorde magnifiquement avec les montures en or et en argent.</p>
<p><strong>Février — Améthyste :</strong> Cette pierre pourpre royale représente la paix et la clarté. Ses tons froids sont saisissants sur l'or rose.</p>
<p><strong>Mars — Aigue-marine :</strong> Le bleu pâle de la mer, l'aigue-marine incarne la sérénité et le courage. Elle est particulièrement étonnante dans les montures minimalistes à sertissage fermé.</p>
<p><strong>Avril — Diamant :</strong> Le symbole ultime de l'amour éternel, les diamants n'ont besoin d'aucune présentation. Ils complètent tous les métaux et tous les styles.</p>
<p><strong>Mai — Émeraude :</strong> Les émeraudes d'un vert profond symbolisent la renaissance et la prospérité. Elles attirent l'attention dans les designs vintage et contemporains.</p>
<p><strong>Juin — Perle :</strong> Classique, lumineuse et éternellement élégante. Les perles représentent la pureté et la sagesse, parfaites pour les tenues de mariage et quotidiennes.</p>
<p><strong>Juillet — Rubis :</strong> Le roi des pierres précieuses, le rouge ardent du rubis représente la passion et la vitalité. Un pendentif ou une bague en rubis fait une déclaration inoubliable.</p>
<p><strong>Août — Péridot :</strong> Le péridot vert lime brillant symbolise la force et la guérison. Sa teinte joyeuse ajoute une touche de couleur à toute boîte à bijoux.</p>
<p><strong>Septembre — Saphir :</strong> Les saphirs bleu profond représentent la sagesse et la noblesse. C'est un choix sophistiqué pour toute occasion.</p>
<p><strong>Octobre — Opale :</strong> Avec son jeu de couleurs fascinant, l'opale symbolise la créativité et l'inspiration. Chaque pierre est entièrement unique.</p>
<p><strong>Novembre — Citrine :</strong> La citrine dorée et chaleureuse rayonne de joie et d'abondance. C'est un ajout ensoleillé à toute collection.</p>
<p><strong>Décembre — Turquoise :</strong> Cette pierre ancienne représente la protection et la bonne fortune. Sa teinte bleu-vert distinctive est immédiatement reconnaissable.</p>
<p>Qu'elle soit portée comme une déclaration solitaire ou superposée à d'autres pièces, la bijouterie de pierre de naissance ajoute une dimension profondément personnelle à votre style.</p>`,
      category: "Idées Cadeaux",
      tags: ['birthstone', 'gemstones', 'personalized', 'guide'],
    },
    ar: {
      title: "مجوهرات أحجار الميلاد: لمسة شخصية",
      excerpt: "اكتشف المعنى الكامن وراء كل حجر ميلاد وكيفية دمجه في أسلوبك اليومي.",
      content: `<p>مجوهرات أحجار الميلاد كانت ثمينة لقرون، ويعتقد أنها تجلب الحظ والحماية والشفاء لمن يرتديها. اليوم، هذه الأحجار الكريمة محتفى بها ليس فقط لرمزيتها، ولكن لجمالها المذهل وتعدد استخداماتها في التصميم الحديث.</p>
<p><strong>يناير — العقيق :</strong> أحمر عميق ونابض بالحياة، يرمز العقيق إلى الصداقة والثقة. يتناسب بشكل جميل مع إطارات الذهب والفضة.</p>
<p><strong>فبراير — الجمشت :</strong> هذا الحجر الأرجواني الملكي يمثل السلام والصفاء. ألوانه الباردة مذهلة على الذهب الوردي.</p>
<p><strong>مارس — الزبرجد :</strong> الأزرق الشاحب للبحر، يجسد الزبرجد الصفاء والشجاعة. إنه مذهل بشكل خاص في الإطارات البسيطة.</p>
<p><strong>أبريل — الماس :</strong> الرمز الأسمى للحب الأبدي، الماس لا يحتاج إلى تعريف. يكمل كل معدن وكل أسلوب.</p>
<p><strong>مايو — الزمرد :</strong> الزمرد الأخضر الغني يرمز إلى الولادة والازدهار. يجذب الانتباه في التصاميم الكلاسيكية والمعاصرة.</p>
<p><strong>يونيو — اللؤلؤ :</strong> كلاسيكي، متألق، وأنيق إلى الأبد. اللؤلؤ يمثل النقاء والحكمة، مثالي لكل من إطلالات الزفاف والارتداء اليومي.</p>
<p><strong>يوليو — الياقوت :</strong> ملك الأحجار الكريمة، الأحمر الناري للياقوت يمثل العاطفة والحيوية. قلادة أو خاتم من الياقوت يصنع بياناً لا يُنسى.</p>
<p><strong>أغسطس — البيريدوت :</strong> البيريدوت الأخضر اللامع يرمز إلى القوة والشفاء. لونه المبهج يضيف لمسة من الألوان لأي صندوق مجوهرات.</p>
<p><strong>سبتمبر — الياقوت الأزرق :</strong> الياقوت الأزرق العميق يمثل الحكمة والنبل. إنه اختيار راقي لأي مناسبة.</p>
<p><strong>أكتوبر — الأوبال :</strong> بتلاعبه الساحر بالألوان، يرمز الأوبال إلى الإبداع والإلهام. كل حجر فريد تماماً.</p>
<p><strong>نوفمبر — السترين :</strong> السترين الذهبي الدافئ يشع بالفرح والوفرة. إنه إضافة مشرقة لأي مجموعة.</p>
<p><strong>ديسمبر — الفيروز :</strong> هذا الحجر القديم يمثل الحماية والحظ السعيد. لونه الأزرق المخضر المميز يمكن التعرف عليه فوراً.</p>
<p>سواء كان مرتدياً كقطعة منفردة أو مكدساً مع قطع أخرى، مجوهرات أحجار الميلاد تضيف بعداً شخصياً عميقاً لأسلوبك.</p>`,
      category: "أفكار هدايا",
      tags: ['birthstone', 'gemstones', 'personalized', 'guide'],
    },
  },
  "clean-store-gold-jewelry": {
    en: {
      title: "How to Clean and Store Your Gold Jewelry",
      excerpt: "Keep your precious pieces sparkling with our professional care guide for gold jewelry maintenance.",
      content: `<p>Gold jewelry is an investment that can last a lifetime — but only with proper care. Regular cleaning and correct storage are essential to maintaining its luminous beauty. Here's how to keep your pieces looking as radiant as the day you received them.</p>
<p><strong>Gentle cleaning at home:</strong> Mix a few drops of mild dish soap with warm water. Soak your gold pieces for 10-15 minutes, then gently brush with a soft-bristled toothbrush. Rinse thoroughly and pat dry with a lint-free cloth. Avoid paper towels, which can scratch the surface.</p>
<p><strong>What to avoid:</strong> Never use harsh chemicals, bleach, or abrasive cleaners. Chlorine and saltwater can damage gold over time, so remove your jewelry before swimming. Similarly, avoid exposing your pieces to perfumes, lotions, and hairsprays — apply these first, then put on your jewelry.</p>
<p><strong>Storage matters:</strong> Store each piece separately to prevent scratching. Use a soft jewelry pouch or a lined jewelry box with individual compartments. Keep your collection away from direct sunlight and humidity, which can tarnish silver and dull gemstones.</p>
<p><strong>Professional maintenance:</strong> Have your pieces professionally inspected once a year. A jeweler can check for loose settings, worn clasps, and signs of wear that need attention. Regular maintenance prevents small issues from becoming costly repairs.</p>
<p>With proper care, your gold jewelry will remain a source of joy and elegance for generations to come.</p>`,
      category: "Jewelry Care",
      tags: ['care', 'cleaning', 'storage', 'gold', 'maintenance'],
    },
    fr: {
      title: "Comment Nettoyer et Ranger Vos Bijoux en Or",
      excerpt: "Gardez vos précieuses pièces étincelantes avec notre guide d'entretien professionnel pour bijoux en or.",
      content: `<p>Les bijoux en or sont un investissement qui peut durer toute une vie — mais seulement avec des soins appropriés. Un nettoyage régulier et un rangement correct sont essentiels pour maintenir leur beauté lumineuse. Voici comment garder vos pièces aussi radieuses que le jour où vous les avez reçues.</p>
<p><strong>Nettoyage doux à la maison :</strong> Mélangez quelques gouttes de savon à vaisselle doux avec de l'eau tiède. Faites tremper vos pièces en or pendant 10 à 15 minutes, puis brossez doucement avec une brosse à dents à poils souples. Rincez abondamment et séchez en tapotant avec un chiffon non pelucheux. Évitez les essuie-tout qui peuvent rayer la surface.</p>
<p><strong>Ce qu'il faut éviter :</strong> N'utilisez jamais de produits chimiques agressifs, d'eau de Javel ou de nettoyants abrasifs. Le chlore et l'eau salée peuvent endommager l'or avec le temps, alors retirez vos bijoux avant de nager. De même, évitez d'exposer vos pièces aux parfums, lotions et laques — appliquez-les d'abord, puis mettez vos bijoux.</p>
<p><strong>Le rangement est important :</strong> Rangez chaque pièce séparément pour éviter les rayures. Utilisez une pochette à bijoux douce ou une boîte à bijoux doublée avec des compartiments individuels. Gardez votre collection à l'abri de la lumière directe du soleil et de l'humidité, qui peuvent ternir l'argent et altérer les pierres précieuses.</p>
<p><strong>Entretien professionnel :</strong> Faites inspecter vos pièces par un professionnel une fois par an. Un bijoutier peut vérifier les sertissages desserrés, les fermoirs usés et les signes d'usure qui nécessitent une attention particulière. Un entretien régulier évite que de petits problèmes ne deviennent des réparations coûteuses.</p>
<p>Avec des soins appropriés, vos bijoux en or resteront une source de joie et d'élégance pour les générations à venir.</p>`,
      category: "Entretien des Bijoux",
      tags: ['care', 'cleaning', 'storage', 'gold', 'maintenance'],
    },
    ar: {
      title: "كيفية تنظيف وتخزين مجوهراتك الذهبية",
      excerpt: "حافظي على تألق قطعك الثمينة مع دليل العناية المهني للمحافظة على المجوهرات الذهبية.",
      content: `<p>المجوهرات الذهبية استثمار يمكن أن يدوم مدى الحياة — ولكن فقط مع العناية المناسبة. التنظيف المنتظم والتخزين الصحيح ضروريان للحفاظ على جمالها المتألق. إليك كيفية الحفاظ على قطعك مشرقة كما في اليوم الذي تلقيتها.</p>
<p><strong>التنظيف اللطيف في المنزل :</strong> اخلطي بضع قطرات من صابون الأطباق المعتدل مع ماء دافئ. انقعي قطعك الذهبية لمدة 10-15 دقيقة، ثم افركي برفق بفرشاة أسنان ناعمة الشعيرات. اشطفي جيداً وجففي بقطعة قماش خالية من الوبر. تجنبي المناشف الورقية التي قد تخدش السطح.</p>
<p><strong>ما يجب تجنبه :</strong> لا تستخدمي أبداً المواد الكيميائية القاسية أو المبيضات أو المنظفات الكاشطة. الكلور والماء المالح يمكن أن يتلفا الذهب مع مرور الوقت، لذا انزعي مجوهراتك قبل السباحة. وبالمثل، تجنبي تعريض قطعك للعطور والمستحضرات وبخاخات الشعر — ضعي هذه أولاً، ثم ارتدي مجوهراتك.</p>
<p><strong>التخزين مهم :</strong> خزني كل قطعة على حدة لمنع الخدوش. استخدمي حقيبة مجوهرات ناعمة أو علبة مجوهرات مبطنة بأقسام فردية. احفظي مجموعتك بعيداً عن أشعة الشمس المباشرة والرطوبة، التي قد تشوه الفضة وتبهت الأحجار الكريمة.</p>
<p><strong>الصيانة الاحترافية :</strong> قومي بفحص قطعك لدى متخصص مرة واحدة في السنة. يمكن للصائغ التحقق من الإعدادات المرتخية والمشابك البالية وعلامات التآكل التي تحتاج إلى عناية. الصيانة المنتظمة تمنع المشكلات الصغيرة من أن تصبح إصلاحات مكلفة.</p>
<p>مع العناية المناسبة، ستبقى مجوهراتك الذهبية مصدراً للبهجة والأناقة لأجيال قادمة.</p>`,
      category: "العناية بالمجوهرات",
      tags: ['care', 'cleaning', 'storage', 'gold', 'maintenance'],
    },
  },
  "jewelry-care-mistakes": {
    en: {
      title: "5 Mistakes That Ruin Your Jewelry",
      excerpt: "Avoid these common jewelry care mistakes that can tarnish, scratch, or damage your precious pieces.",
      content: `<p>Even the most beautiful jewelry can lose its lustre with improper care. We've identified the five most common mistakes that accelerate wear and tear — and how to avoid them.</p>
<p><strong>1. Wearing jewelry in the shower.</strong> Soap, shampoo, and conditioner leave a film that dulls the shine of gold and gemstones. The moisture also weakens clasps and stretches chains over time. Always remove your jewelry before washing.</p>
<p><strong>2. Sleeping in your pieces.</strong> Your movements during sleep can bend prongs, loosen stones, and tangle chains. Make it a habit to remove your jewelry before bed and store it properly.</p>
<p><strong>3. Using ultrasonic cleaners on delicate pieces.</strong> While convenient, ultrasonic cleaners can damage fragile gemstones like pearls, opals, and emeralds. Stick to gentle hand cleaning for these pieces.</p>
<p><strong>4. Storing pieces all together.</strong> Throwing all your jewelry into one box invites scratches and tangles. Harder gemstones like diamonds can scratch softer metals like gold. Separate each piece in its own compartment or pouch.</p>
<p><strong>5. Ignoring worn clasps and settings.</strong> A loose clasp or prong is an accident waiting to happen. If you notice any sign of wear, take your piece to a jeweler immediately. Prevention is far less costly than replacement.</p>
<p>By avoiding these common pitfalls, your jewelry will maintain its brilliance and structural integrity for years to come.</p>`,
      category: "Jewelry Care",
      tags: ['care', 'mistakes', 'maintenance', 'prevention'],
    },
    fr: {
      title: "5 Erreurs Qui Ruinent Vos Bijoux",
      excerpt: "Évitez ces erreurs courantes d'entretien qui peuvent ternir, rayer ou endommager vos précieuses pièces.",
      content: `<p>Même les plus beaux bijoux peuvent perdre leur éclat avec un entretien inapproprié. Nous avons identifié les cinq erreurs les plus courantes qui accélèrent l'usure — et comment les éviter.</p>
<p><strong>1. Porter des bijoux sous la douche.</strong> Le savon, le shampooing et l'après-shampooing laissent un film qui ternit l'éclat de l'or et des pierres précieuses. L'humidité affaiblit également les fermoirs et étire les chaînes avec le temps. Retirez toujours vos bijoux avant de vous laver.</p>
<p><strong>2. Dormir avec vos bijoux.</strong> Vos mouvements pendant le sommeil peuvent plier les griffes, desserrer les pierres et emmêler les chaînes. Prenez l'habitude de retirer vos bijoux avant de vous coucher et de les ranger correctement.</p>
<p><strong>3. Utiliser des nettoyeurs à ultrasons sur les pièces délicates.</strong> Bien que pratiques, les nettoyeurs à ultrasons peuvent endommager les pierres précieuses fragiles comme les perles, les opales et les émeraudes. Limitez-vous à un nettoyage manuel doux pour ces pièces.</p>
<p><strong>4. Ranger toutes les pièces ensemble.</strong> Jeter tous vos bijoux dans une seule boîte invite aux rayures et aux enchevêtrements. Les pierres précieuses plus dures comme les diamants peuvent rayer les métaux plus mous comme l'or. Séparez chaque pièce dans son propre compartiment ou pochette.</p>
<p><strong>5. Ignorer les fermoirs et sertissages usés.</strong> Un fermoir ou une griffe desserré est un accident qui n'attend qu'à arriver. Si vous remarquez un signe d'usure, apportez immédiatement votre pièce à un bijoutier. La prévention coûte bien moins cher que le remplacement.</p>
<p>En évitant ces pièges courants, vos bijoux conserveront leur brillance et leur intégrité structurelle pour les années à venir.</p>`,
      category: "Entretien des Bijoux",
      tags: ['care', 'mistakes', 'maintenance', 'prevention'],
    },
    ar: {
      title: "5 أخطاء تدمر مجوهراتك",
      excerpt: "تجنبي أخطاء العناية بالمجوهرات الشائعة هذه التي قد تشوه أو تخدش أو تتلف قطعك الثمينة.",
      content: `<p>حتى أجمل المجوهرات يمكن أن تفقد بريقها مع العناية غير السليمة. لقد حددنا الأخطاء الخمسة الأكثر شيوعاً التي تسرع التآكل والاهتراء — وكيفية تجنبها.</p>
<p><strong>1. ارتداء المجوهرات في الحمام.</strong> الصابون والشامبو والبلسم يتركون طبقة رقيقة تبهت لمعان الذهب والأحجار الكريمة. الرطوبة أيضاً تضعف المشابك وتمد السلاسل مع مرور الوقت. انزعي مجوهراتك دائماً قبل الاستحمام.</p>
<p><strong>2. النوم بقطعك.</strong> حركاتك أثناء النوم يمكن أن تثني الأسنان المعدنية، وتفك الأحجار، وتشابك السلاسل. اجعلي من عادتك إزالة مجوهراتك قبل النوم وتخزينها بشكل صحيح.</p>
<p><strong>3. استخدام أجهزة التنظيف بالموجات فوق الصوتية على القطع الحساسة.</strong> بينما هي مريحة، أجهزة التنظيف بالموجات فوق الصوتية يمكن أن تتلف الأحجار الكريمة الهشة مثل اللؤلؤ والأوبال والزمرد. اكتفي بالتنظيف اليدوي اللطيف لهذه القطع.</p>
<p><strong>4. تخزين القطع معاً.</strong> رمي كل مجوهراتك في صندوق واحد يدعو للخدوش والتشابك. الأحجار الكريمة الأكثر صلابة مثل الماس يمكن أن تخدش المعادن الأكثر ليونة مثل الذهب. افصلي كل قطعة في حجرتها أو حقيبتها الخاصة.</p>
<p><strong>5. تجاهل المشابك والإعدادات البالية.</strong> المشبك أو السن المعدني المرتخي هو حادثة تنتظر الحدوث. إذا لاحظت أي علامة تآكل، خذي قطعتك إلى صائغ فوراً. الوقاية أقل تكلفة بكثير من الاستبدال.</p>
<p>بتجنب هذه الأخطاء الشائعة، ستحافظ مجوهراتك على بريقها وسلامتها الهيكلية لسنوات قادمة.</p>`,
      category: "العناية بالمجوهرات",
      tags: ['care', 'mistakes', 'maintenance', 'prevention'],
    },
  },
  "desk-to-dinner-jewelry": {
    en: {
      title: "From Desk to Dinner: Jewelry That Transitions",
      excerpt: "Discover versatile pieces that take you seamlessly from the boardroom to an evening out without missing a beat.",
      content: `<p>The modern woman's life is multifaceted — and her jewelry should be too. Pieces that transition effortlessly from day to night are essential for those who move from professional meetings to social engagements without skipping a beat.</p>
<p><strong>The power of convertible pieces.</strong> Look for earrings with detachable drops, necklaces with adjustable lengths, and rings that can be worn solo or stacked. A single versatile piece can create multiple looks, making it a smart investment.</p>
<p><strong>Daytime strategy:</strong> For the office, opt for refined minimalism. Small hoops, a simple pendant, and a classic watch convey professionalism without distraction. Choose pieces that sit close to the body and won't catch on fabrics or equipment.</p>
<p><strong>Evening transformation:</strong> As the workday ends, add layers and drama. Clip on statement drops, stack your rings, and add a second or third necklace. The same foundation pieces become something entirely new with a few strategic additions.</p>
<p><strong>Essential transition pieces:</strong> A pair of diamond studs works for every occasion. A simple gold chain can be worn alone by day and layered by night. A classic bangle or cuff adds polish to any look.</p>
<p>The key to seamless transitions is choosing quality foundational pieces that can be dressed up or down. Invest in versatility, and your jewelry box will work as hard as you do.</p>`,
      category: "Women's Style",
      tags: ['versatile', 'transition', 'day-to-night', 'style'],
    },
    fr: {
      title: "Du Bureau au Dîner : Des Bijoux qui S'Adaptent",
      excerpt: "Découvrez des pièces polyvalentes qui vous accompagnent du bureau à une soirée sans manquer un battement.",
      content: `<p>La vie de la femme moderne est aux multiples facettes — et ses bijoux devraient l'être aussi. Les pièces qui passent facilement du jour à la nuit sont essentielles pour celles qui passent des réunions professionnelles aux engagements sociaux sans perdre le rythme.</p>
<p><strong>Le pouvoir des pièces convertibles.</strong> Recherchez des boucles d'oreilles à gouttes détachables, des colliers à longueur ajustable et des bagues qui peuvent être portées seules ou superposées. Une seule pièce polyvalente peut créer plusieurs looks, ce qui en fait un investissement judicieux.</p>
<p><strong>Stratégie de jour :</strong> Pour le bureau, optez pour un minimalisme raffiné. De petites créoles, un simple pendentif et une montre classique transmettent le professionnalisme sans distraction. Choisissez des pièces qui restent près du corps et qui ne s'accrocheront pas aux tissus ou aux équipements.</p>
<p><strong>Transformation du soir :</strong> À la fin de la journée de travail, ajoutez des couches et du panache. Accrochez des gouttes statement, superposez vos bagues et ajoutez un deuxième ou troisième collier. Les mêmes pièces de base deviennent quelque chose d'entièrement nouveau avec quelques ajouts stratégiques.</p>
<p><strong>Pièces de transition essentielles :</strong> Une paire de puces en diamant convient à toutes les occasions. Une simple chaîne en or peut être portée seule le jour et superposée le soir. Un bracelet classique ou un manchette ajoute du raffinement à n'importe quel look.</p>
<p>La clé des transitions harmonieuses est de choisir des pièces de base de qualité qui peuvent être habillées ou décontractées. Investissez dans la polyvalence, et votre boîte à bijoux travaillera aussi dur que vous.</p>`,
      category: "Style Féminin",
      tags: ['versatile', 'transition', 'day-to-night', 'style'],
    },
    ar: {
      title: "من المكتب إلى العشاء: مجوهرات تتنقل معك",
      excerpt: "اكتشفي قطعاً متعددة الاستخدامات تأخذك بسلاسة من غرفة الاجتماعات إلى السهرة دون توقف.",
      content: `<p>حياة المرأة العصرية متعددة الأوجه — ومجوهراتها يجب أن تكون كذلك. القطع التي تنتقل بسهولة من النهار إلى الليل ضرورية لمن تتنقل من الاجتماعات المهنية إلى المناسبات الاجتماعية دون توقف.</p>
<p><strong>قوة القطع القابلة للتحويل.</strong> ابحثي عن أقراط بقلادات قابلة للفصل، وقلائد بأطوال قابلة للتعديل، وخواتم يمكن ارتداؤها منفردة أو مكدسة. قطعة واحدة متعددة الاستخدامات يمكن أن تخلق إطلالات متعددة، مما يجعلها استثماراً ذكياً.</p>
<p><strong>إستراتيجية النهار :</strong> للمكتب، اختاري الأناقة البسيطة. أقراط حلقية صغيرة، وقلادة بسيطة، وساعة كلاسيكية تنقل الاحترافية دون إلهاء. اختاري قطعاً قريبة من الجسم ولا تعلق بالأقمشة أو المعدات.</p>
<p><strong>تحول المساء :</strong> مع انتهاء يوم العمل، أضيفي طبقات وجاذبية. أضيفي الأقراط المميزة، وكومي خواتمك، وأضيفي قلادة ثانية أو ثالثة. نفس القطع الأساسية تصبح شيئاً جديداً كلياً مع بعض الإضافات الإستراتيجية.</p>
<p><strong>قطع انتقالية أساسية :</strong> زوج من الأقراط الماسية الصغيرة يناسب كل مناسبة. سلسلة ذهبية بسيطة يمكن ارتداؤها منفردة نهاراً ومتعددة الطبقات ليلاً. سوار أو أسوارة كلاسيكية تضيف لمسة من الرقي لأي إطلالة.</p>
<p>مفتاح الانتقال السلس هو اختيار قطع أساسية عالية الجودة يمكن تنسيقها لأعلى أو لأسفل. استثمري في التنوع، وستعمل علبة مجوهراتك بقدر ما تعملين أنت.</p>`,
      category: "أناقة المرأة",
      tags: ['versatile', 'transition', 'day-to-night', 'style'],
    },
  },
  "power-of-statement-earrings": {
    en: {
      title: "The Power of Statement Earrings",
      excerpt: "Why bold earrings are the ultimate confidence booster and how to choose the perfect pair for your face shape.",
      content: `<p>There's something transformative about a pair of statement earrings. They frame the face, catch the light, and announce your presence before you speak a word. In the world of jewelry, few pieces have the immediate impact of bold earrings.</p>
<p><strong>Why they work:</strong> Statement earrings draw attention upward, highlighting your eyes and cheekbones. They create a focal point that elevates even the simplest outfit — a white shirt and jeans become a curated look with the right pair.</p>
<p><strong>Choosing for your face shape:</strong> Round faces benefit from angular, elongated designs that create vertical lines. Oval faces can wear almost any style, from hoops to drops to studs. Heart-shaped faces are balanced by wider bottom-heavy designs. Square faces are softened by rounded, organic shapes.</p>
<p><strong>Material matters:</strong> Gold statement earrings offer warmth and versatility. Silver and white gold provide a cooler, contemporary edge. Mixed-metal designs offer maximum flexibility for pairing with other pieces.</p>
<p><strong>When to wear them:</strong> The beauty of statement earrings is that they're appropriate for almost any occasion — from brunch with friends to evening galas. The key is matching the scale to the setting. Save the most dramatic pieces for occasions where you want to make an impression.</p>
<p>Your ears are the perfect canvas for self-expression. Choose earrings that speak to your personality, and wear them with the confidence they deserve.</p>`,
      category: "Women's Style",
      tags: ['earrings', 'statement', 'style', 'confidence'],
    },
    fr: {
      title: "Le Pouvoir des Boucles d'Oreilles Statement",
      excerpt: "Pourquoi les boucles d'oreilles audacieuses sont le meilleur booster de confiance et comment choisir la paire parfaite pour votre forme de visage.",
      content: `<p>Il y a quelque chose de transformateur dans une paire de boucles d'oreilles statement. Elles encadrent le visage, captent la lumière et annoncent votre présence avant même que vous ne prononciez un mot. Dans le monde de la bijouterie, rares sont les pièces qui ont l'impact immédiat des boucles d'oreilles audacieuses.</p>
<p><strong>Pourquoi elles fonctionnent :</strong> Les boucles d'oreilles statement attirent l'attention vers le haut, mettant en valeur vos yeux et vos pommettes. Elles créent un point focal qui rehausse même la tenue la plus simple — une chemise blanche et un jean deviennent un look curatoriel avec la bonne paire.</p>
<p><strong>Choisir selon la forme de votre visage :</strong> Les visages ronds bénéficient de designs angulaires et allongés qui créent des lignes verticales. Les visages ovales peuvent porter presque tous les styles, des créoles aux gouttes en passant par les puces. Les visages en cœur sont équilibrés par des designs plus larges en bas. Les visages carrés sont adoucis par des formes rondes et organiques.</p>
<p><strong>Le matériau compte :</strong> Les boucles d'oreilles statement en or offrent chaleur et polyvalence. L'argent et l'or blanc apportent une touche plus fraîche et contemporaine. Les designs en métaux mélangés offrent une flexibilité maximale pour l'association avec d'autres pièces.</p>
<p><strong>Quand les porter :</strong> La beauté des boucles d'oreilles statement est qu'elles conviennent à presque toutes les occasions — du brunch entre amis aux galas du soir. La clé est d'adapter l'échelle au cadre. Réservez les pièces les plus dramatiques pour les occasions où vous voulez faire impression.</p>
<p>Vos oreilles sont la toile parfaite pour l'expression de soi. Choisissez des boucles d'oreilles qui parlent à votre personnalité et portez-les avec la confiance qu'elles méritent.</p>`,
      category: "Style Féminin",
      tags: ['earrings', 'statement', 'style', 'confidence'],
    },
    ar: {
      title: "قوة الأقراط الجريئة",
      excerpt: "لماذا الأقراط الجريئة هي المعزز النهائي للثقة وكيفية اختيار الزوج المثالي لشكل وجهك.",
      content: `<p>هناك شيء تحولي في زوج من الأقراط الجريئة. إنها تؤطر الوجه، وتلتقط الضوء، وتعلن عن حضورك قبل أن تنطقي بكلمة. في عالم المجوهرات، قليل من القطع لها التأثير الفوري للأقراط الجريئة.</p>
<p><strong>لماذا تعمل :</strong> الأقراط الجريئة تجذب الانتباه إلى الأعلى، وتبرز عينيك وعظام وجنتيك. إنها تخلق نقطة محورية ترفع حتى أبسط الإطلالات — قميص أبيض وجينز يصبحان إطلالة منسقة مع الزوج المناسب.</p>
<p><strong>الاختيار حسب شكل وجهك :</strong> الوجوه المستديرة تستفيد من التصاميم الزاويّة والطويلة التي تخلق خطوطاً عمودية. الوجوه البيضاوية يمكنها ارتداء أي نمط تقريباً، من الحلقية إلى المتدلية إلى المرصعة. الوجوه على شكل قلب تتوازن مع تصاميم أوسع في الأسفل. الوجوه المربعة تلينها الأشكال المستديرة والعضوية.</p>
<p><strong>المادة مهمة :</strong> الأقراط الذهبية الجريئة تقدم الدفء والتنوع. الفضة والذهب الأبيض يقدمان حافة أكثر برودة وعصرية. التصاميم متعددة المعادن توفر أقصى مرونة للتناسق مع القطع الأخرى.</p>
<p><strong>متى ترتديها :</strong> جمال الأقراط الجريئة هو أنها مناسبة تقريباً لأي مناسبة — من فطور مع الأصدقاء إلى حفلات السهرة. المفتاح هو مطابقة الحجم مع المكان. احتفظي بأكثر القطع جرأة للمناسبات التي تريدين فيها ترك انطباع.</p>
<p>أذناك هما اللوحة المثالية للتعبير عن الذات. اختاري أقراطاً تتحدث عن شخصيتك، وارتديها بالثقة التي تستحقها.</p>`,
      category: "أناقة المرأة",
      tags: ['earrings', 'statement', 'style', 'confidence'],
    },
  },
  "sahara-collection-launch": {
    en: {
      title: "Introducing the Sahara Collection",
      excerpt: "Our newest collection draws inspiration from the golden dunes and rich heritage of Morocco.",
      content: `<p>We are proud to unveil the Sahara Collection — a celebration of the timeless beauty and cultural richness of Morocco. Inspired by the sweeping golden dunes, the intricate patterns of traditional architecture, and the warm, luminous light of the desert, this collection is our most personal yet.</p>
<p><strong>The inspiration:</strong> Morocco has always been a source of wonder for us. The way light plays across the sand, the geometric precision of zellij tilework, the deep indigos and warm terracottas of the souks — every element of the Sahara Collection reflects a piece of this landscape.</p>
<p><strong>The craftsmanship:</strong> Each piece is hand-finished by master artisans using techniques passed down through generations. We've combined traditional Moroccan filigree with contemporary silhouettes to create jewelry that feels both heritage-rich and thoroughly modern.</p>
<p><strong>The materials:</strong> The Sahara Collection features 14k and 18k gold, sterling silver, and ethically sourced gemstones including carnelian, turquoise, and mother of pearl — each chosen for its connection to the Moroccan palette.</p>
<p><strong>The pieces:</strong> From crescent-shaped pendants that echo the desert moon to cuff bracelets engraved with geometric motifs, every item in the collection tells a story. These are pieces designed to be worn, cherished, and passed down.</p>
<p>The Sahara Collection is now available exclusively at ccjaouhara. We invite you to discover the magic of Morocco, reimagined for the modern woman.</p>`,
      category: "New Collections",
      tags: ['sahara', 'collection', 'morocco', 'launch', 'new'],
    },
    fr: {
      title: "Présentation de la Collection Sahara",
      excerpt: "Notre nouvelle collection s'inspire des dunes dorées et du riche patrimoine du Maroc.",
      content: `<p>Nous sommes fiers de dévoiler la Collection Sahara — une célébration de la beauté intemporelle et de la richesse culturelle du Maroc. Inspirée par les vastes dunes dorées, les motifs complexes de l'architecture traditionnelle et la lumière chaude et lumineuse du désert, cette collection est notre plus personnelle à ce jour.</p>
<p><strong>L'inspiration :</strong> Le Maroc a toujours été une source d'émerveillement pour nous. La façon dont la lumière joue sur le sable, la précision géométrique des carreaux de zellij, les indigos profonds et les terres cuites chaudes des souks — chaque élément de la Collection Sahara reflète un morceau de ce paysage.</p>
<p><strong>Le savoir-faire :</strong> Chaque pièce est finie à la main par des artisans maîtres utilisant des techniques transmises de génération en génération. Nous avons combiné la filigrane marocaine traditionnelle avec des silhouettes contemporaines pour créer des bijoux à la fois riches en héritage et résolument modernes.</p>
<p><strong>Les matériaux :</strong> La Collection Sahara comprend de l'or 14k et 18k, de l'argent sterling et des pierres précieuses éthiques, notamment la cornaline, la turquoise et la nacre — chacune choisie pour son lien avec la palette marocaine.</p>
<p><strong>Les pièces :</strong> Des pendentifs en croissant qui évoquent la lune du désert aux bracelets manchette gravés de motifs géométriques, chaque article de la collection raconte une histoire. Ce sont des pièces conçues pour être portées, chéries et transmises.</p>
<p>La Collection Sahara est désormais disponible exclusivement chez ccjaouhara. Nous vous invitons à découvrir la magie du Maroc, réimaginée pour la femme moderne.</p>`,
      category: "Nouvelles Collections",
      tags: ['sahara', 'collection', 'morocco', 'launch', 'new'],
    },
    ar: {
      title: "إطلاق مجموعة الصحراء",
      excerpt: "مجموعتنا الجديدة تستلهم الإلهام من الكثبان الذهبية والتراث الغني للمغرب.",
      content: `<p>نحن فخورون بالكشف عن مجموعة الصحراء — احتفال بالجمال الخالد والثراء الثقافي للمغرب. مستوحاة من الكثبان الذهبية الممتدة، والأنماط المعقدة للهندسة المعمارية التقليدية، والضوء الدافئ الساطع للصحراء، هذه المجموعة هي الأكثر شخصية لدينا حتى الآن.</p>
<p><strong>الإلهام :</strong> لطالما كان المغرب مصدر إلهام لنا. الطريقة التي يلعب بها الضوء على الرمال، والدقة الهندسية لبلاط الزليج، والنيلي العميق والتراكوتا الدافئة للأسواق — كل عنصر من عناصر مجموعة الصحراء يعكس جزءاً من هذا المشهد.</p>
<p><strong>الحرفية :</strong> كل قطعة تُنهى يدوياً على يد حرفيين مهرة يستخدمون تقنيات توارثتها الأجيال. لقد جمعنا بين الفيليغران المغربي التقليدي والصور الظلية المعاصرة لخلق مجوهرات غنية بالتراث وحديثة تماماً.</p>
<p><strong>المواد :</strong> تتميز مجموعة الصحراء بالذهب عيار 14 و18 قيراطاً، والفضة الإسترلينية، والأحجار الكريمة الأخلاقية بما في ذلك العقيق الأحمر والفيروز وعرق اللؤلؤ — كل منها اختير لارتباطه بلوحة الألوان المغربية.</p>
<p><strong>القطع :</strong> من القلائد الهلالية التي تعكس قمر الصحراء إلى أساور الكاف المزخرفة بنقوش هندسية، كل عنصر في المجموعة يروي قصة. هذه قطع صممت لترتدى وتُعتز بها وتُورث.</p>
<p>مجموعة الصحراء متاحة الآن حصرياً في ccjaouhara. ندعوك لاكتشاف سحر المغرب، معاد تخيله للمرأة العصرية.</p>`,
      category: "مجموعات جديدة",
      tags: ['sahara', 'collection', 'morocco', 'launch', 'new'],
    },
  },
  "behind-design-moroccan-heritage": {
    en: {
      title: "Behind the Design: Moroccan Heritage",
      excerpt: "Step into our creative process and discover how traditional Moroccan artistry shapes our latest designs.",
      content: `<p>Every piece in our collection begins with a story. For us, that story is deeply rooted in the rich artistic heritage of Morocco — a country where craftsmanship is not just a trade, but a way of life passed down through generations.</p>
<p><strong>The art of filigree:</strong> Moroccan filigree is a meticulous craft that involves twisting and soldering fine threads of gold and silver into intricate patterns. This technique, perfected over centuries in the medinas of Fez and Marrakech, produces lace-like metalwork of astonishing detail.</p>
<p><strong>Geometric inspiration:</strong> Islamic geometric patterns, found in Morocco's most treasured architecture, inform many of our designs. The repeating stars, interlocking circles, and rhythmic polygons are translated into jewelry that captures the mathematical beauty of traditional zellij and carved stucco.</p>
<p><strong>Colour palette:</strong> The colours of Morocco are unmistakable — the deep blue of Chefchaouen, the terracotta of Aït Benhaddou, the gold of the Sahara, the green of the Atlas valleys. These hues guide our gemstone selections and metal choices.</p>
<p><strong>Modern interpretation:</strong> While we honor traditional techniques, our designs are thoroughly contemporary. We distill centuries of artistry into clean, wearable forms that complement modern lifestyles. The result is jewelry that bridges past and present.</p>
<p>Every ccjaouhara piece carries a piece of Morocco's soul. We're proud to share our heritage with women around the world.</p>`,
      category: "New Collections",
      tags: ['morocco', 'heritage', 'design', 'craftsmanship', 'inspiration'],
    },
    fr: {
      title: "Dans les Coulisses du Design : Héritage Marocain",
      excerpt: "Plongez dans notre processus créatif et découvrez comment l'artisanat traditionnel marocain façonne nos dernières créations.",
      content: `<p>Chaque pièce de notre collection commence par une histoire. Pour nous, cette histoire est profondément ancrée dans le riche héritage artistique du Maroc — un pays où l'artisanat n'est pas seulement un métier, mais un mode de vie transmis de génération en génération.</p>
<p><strong>L'art du filigrane :</strong> Le filigrane marocain est un artisanat méticuleux qui consiste à tordre et souder de fins fils d'or et d'argent en motifs complexes. Cette technique, perfectionnée au fil des siècles dans les médinas de Fès et de Marrakech, produit une métallerie dentelle d'un détail étonnant.</p>
<p><strong>Inspiration géométrique :</strong> Les motifs géométriques islamiques, présents dans l'architecture la plus précieuse du Maroc, inspirent nombre de nos créations. Les étoiles répétées, les cercles entrelacés et les polygones rythmiques sont traduits en bijoux qui capturent la beauté mathématique du zellij traditionnel et du stuc sculpté.</p>
<p><strong>Palette de couleurs :</strong> Les couleurs du Maroc sont indéniables — le bleu profond de Chefchaouen, la terre cuite d'Aït Benhaddou, l'or du Sahara, le vert des vallées de l'Atlas. Ces teintes guident nos sélections de pierres précieuses et nos choix de métaux.</p>
<p><strong>Interprétation moderne :</strong> Bien que nous honorions les techniques traditionnelles, nos créations sont résolument contemporaines. Nous distillons des siècles d'artisanat en formes épurées et portables qui complètent les modes de vie modernes. Le résultat est une bijouterie qui fait le pont entre le passé et le présent.</p>
<p>Chaque pièce ccjaouhara porte un morceau de l'âme du Maroc. Nous sommes fiers de partager notre héritage avec les femmes du monde entier.</p>`,
      category: "Nouvelles Collections",
      tags: ['morocco', 'heritage', 'design', 'craftsmanship', 'inspiration'],
    },
    ar: {
      title: "خلف التصميم: التراث المغربي",
      excerpt: "اقتربي من عمليتنا الإبداعية واكتشفي كيف تشكل الفنون المغربية التقليدية أحدث تصاميمنا.",
      content: `<p>كل قطعة في مجموعتنا تبدأ بقصة. بالنسبة لنا، هذه القصة متجذرة بعمق في التراث الفني الغني للمغرب — بلد حيث الحرفية ليست مجرد مهنة، بل أسلوب حياة ينتقل عبر الأجيال.</p>
<p><strong>فن الفيليغران :</strong> الفيليغران المغربي هو حرفة دقيقة تتضمن لف ولحام خيوط رفيعة من الذهب والفضة في أنماط معقدة. هذه التقنية، التي أتقنت على مر القرون في مدينتي فاس ومراكش، تنتج أعمالاً معدنية كالدانتيل بتفاصيل مذهلة.</p>
<p><strong>الإلهام الهندسي :</strong> الأنماط الهندسية الإسلامية، الموجودة في أعز العمارة المغربية، تلهم العديد من تصاميمنا. النجوم المتكررة، والدوائر المتشابكة، والمضلعات الإيقاعية تترجم إلى مجوهرات تلتقط الجمال الرياضي للزليج التقليدي والجص المنحوت.</p>
<p><strong>لوحة الألوان :</strong> ألوان المغرب لا تُخطئ — الأزرق العميق لشفشاون، والتراكوتا لقصر آيت بن حدو، والذهب للصحراء، والأخضر لوديان الأطلس. هذه الدرجات توجه اختياراتنا للأحجار الكريمة والمعادن.</p>
<p><strong>التفسير الحديث :</strong> بينما نكرم التقنيات التقليدية، تصاميمنا معاصرة تماماً. نستخلص قروناً من الفن في أشكال نظيفة وقابلة للارتداء تكمل أنماط الحياة الحديثة. النتيجة هي مجوهرات تجسر الماضي والحاضر.</p>
<p>كل قطعة من ccjaouhara تحمل جزءاً من روح المغرب. نحن فخورون بمشاركة تراثنا مع نساء حول العالم.</p>`,
      category: "مجموعات جديدة",
      tags: ['morocco', 'heritage', 'design', 'craftsmanship', 'inspiration'],
    },
  },
};
