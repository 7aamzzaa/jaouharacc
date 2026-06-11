import { BlogPost } from '../types';

export const blogCategories = [
  'Jewelry Trends',
  'Fashion Tips',
  'Gift Ideas',
  'Jewelry Care',
  "Women's Style",
  'New Collections',
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: '2026 Jewelry Trends: What\'s In This Season',
    slug: '2026-jewelry-trends',
    excerpt: 'From sculptural gold to nature-inspired motifs, discover the defining jewelry trends shaping elegance this year.',
    content: `<p>The world of fine jewelry is constantly evolving, and 2026 brings a refreshing blend of bold statements and delicate craftsmanship. This season, we're seeing a shift toward pieces that tell a story — each curve, texture, and gemstone chosen with intention.</p>
<p>Sculptural gold takes center stage, with fluid, organic shapes that mimic the movement of water and wind. Designers are moving away from rigid symmetry, embracing asymmetrical forms that feel both modern and timeless.</p>
<p>Nature-inspired motifs continue to captivate, with leaves, vines, and floral patterns rendered in precious metals. The trend extends beyond mere aesthetics — it reflects a deeper connection to the natural world and sustainable luxury.</p>
<p>Layered necklaces remain a staple, but the approach has evolved. Mixed lengths, varied textures, and the interplay of gold and silver create a curated, personal look. The key is balance — let one piece lead while others complement.</p>
<p>Earrings are growing bolder. Statement hoops, sculptural drops, and architectural studs frame the face with confidence. The bigger, the better — but always with an air of refinement.</p>
<p>As we move through the year, expect to see more personalized pieces, custom engravings, and modular designs that adapt to every occasion. Jewelry is no longer just an accessory — it's an extension of identity.</p>`,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    category: 'Jewelry Trends',
    author: 'ccjaouhara Atelier',
    date: '2026-03-15',
    tags: ['trends', 'gold', 'design', '2026'],
  },
  {
    id: 'blog-2',
    title: 'The Rise of Sustainable Luxury Jewelry',
    slug: 'sustainable-luxury-jewelry',
    excerpt: 'Why modern consumers are choosing ethically sourced materials and artisanal craftsmanship over mass production.',
    content: `<p>Sustainability is no longer a niche concern — it's a defining value for today's discerning jewelry buyer. The modern consumer wants to know where their pieces come from, who made them, and what impact they have on the world.</p>
<p>At ccjaouhara, we've always believed that true luxury is rooted in responsibility. Our pieces are crafted using ethically sourced materials, with a commitment to minimizing environmental impact while maximizing beauty and durability.</p>
<p>The shift toward sustainable luxury is driven by a desire for meaning. A piece of jewelry is more than an ornament — it's a keepsake, a story, a legacy. Knowing that it was created with care for both people and the planet adds immeasurable value.</p>
<p>Artisanal craftsmanship is experiencing a renaissance. Consumers are gravitating toward hand-finished pieces that bear the mark of their maker, moving away from impersonal mass production. Each imperfection tells a story of human hands at work.</p>
<p>Recycled metals, lab-grown gemstones, and responsible sourcing are becoming the new standard. The industry is evolving, and we're proud to be part of that transformation — creating jewelry that's as ethical as it is exquisite.</p>`,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1200',
    category: 'Jewelry Trends',
    author: 'ccjaouhara Atelier',
    date: '2026-02-28',
    tags: ['sustainability', 'ethical', 'craftsmanship', 'luxury'],
  },
  {
    id: 'blog-3',
    title: 'How to Layer Necklaces Like a Stylist',
    slug: 'how-to-layer-necklaces',
    excerpt: 'Master the art of necklace layering with our expert guide — from chain lengths to pendant placement.',
    content: `<p>Necklace layering is one of the most elegant ways to elevate any outfit. When done right, it creates a harmonious composition that draws the eye and adds depth to your look. But mastering the art requires a bit of know-how.</p>
<p><strong>Start with a focal point.</strong> Choose one pendant or statement piece as the anchor of your arrangement. This could be a solitaire diamond drop, a pearl medallion, or a personalized initial. Build your layers around it.</p>
<p><strong>Vary your chain lengths.</strong> The golden rule is to keep at least 5cm (2 inches) between each layer. A typical arrangement might include a 40cm choker, a 45cm princess length, and a 50cm matinee chain. This prevents tangling and creates visual interest.</p>
<p><strong>Mix textures and metals.</strong> Don't be afraid to combine different chain styles — a delicate cable chain, a chunky figaro, and a beaded strand can coexist beautifully. Similarly, mixing yellow gold, rose gold, and silver adds dimension when done with intention.</p>
<p><strong>Consider your neckline.</strong> The shape of your collar determines which layering strategy works best. V-necks pair well with graduated layers, while crew necks call for longer chains that fall below the collarbone.</p>
<p>Remember: confidence is your best accessory. Experiment, trust your eye, and wear what makes you feel radiant.</p>`,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    category: 'Fashion Tips',
    author: 'ccjaouhara Atelier',
    date: '2026-03-10',
    tags: ['styling', 'necklaces', 'layering', 'fashion'],
  },
  {
    id: 'blog-4',
    title: 'Mixing Metals: The Modern Guide',
    slug: 'mixing-metals-guide',
    excerpt: 'Gone are the days of committing to one metal. Learn how to confidently mix gold, silver, and rose gold.',
    content: `<p>For decades, fashion rules dictated that gold and silver should never mix. Thankfully, those days are behind us. Today's most stylish looks embrace the art of metal mixing, creating dynamic, personalized combinations that express individuality.</p>
<p><strong>Find your unifying element.</strong> The secret to successful metal mixing is a common thread. This could be a shared gemstone color, a consistent texture, or a similar design language. When each piece has something in common with the others, the combination feels intentional rather than accidental.</p>
<p><strong>Use one metal as your base.</strong> Choose a dominant metal for the majority of your pieces, then introduce accents in a contrasting tone. For example, wear mostly yellow gold with one or two silver pieces as highlights.</p>
<p><strong>Consider your skin tone.</strong> While personal preference always comes first, certain metals complement different complexions. Warm skin tones glow with yellow and rose gold, while cool skin tones shine with white gold and silver. But rules are made to be broken — confidence trumps everything.</p>
<p><strong>Stack strategically.</strong> If you're wearing multiple rings, bracelets, or necklaces, distribute the metals evenly. A balanced composition prevents any single colour from overwhelming the arrangement.</p>
<p>The modern approach to jewelry is personal, expressive, and free from outdated conventions. Mix, match, and make it yours.</p>`,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    category: 'Fashion Tips',
    author: 'ccjaouhara Atelier',
    date: '2026-02-20',
    tags: ['styling', 'metals', 'gold', 'silver', 'fashion'],
  },
  {
    id: 'blog-5',
    title: 'The Ultimate Jewelry Gift Guide for Every Occasion',
    slug: 'jewelry-gift-guide',
    excerpt: 'From birthdays to anniversaries, find the perfect piece for every special moment in her life.',
    content: `<p>Choosing the perfect jewelry gift is an art. Whether you're celebrating a milestone or simply showing appreciation, the right piece speaks volumes. Here's our guide to selecting jewelry that will be treasured forever.</p>
<p><strong>For birthdays,</strong> consider birthstone jewelry. A pendant or ring featuring her birth gemstone adds a personal touch that shows thought and care. Each stone carries its own symbolism, making the gift deeply meaningful.</p>
<p><strong>Anniversaries call for timeless pieces.</strong> Diamond studs, a classic tennis bracelet, or a solitaire pendant are investments in elegance that will be worn for decades. These are pieces that become heirlooms.</p>
<p><strong>For engagements and weddings,</strong> the ring is just the beginning. Consider matching earrings or a delicate necklace that complements the bridal look. Many brides appreciate a gift that marks both the occasion and the beginning of a new chapter.</p>
<p><strong>Graduations and achievements</strong> deserve symbols of accomplishment. A signet ring, a personalized charm bracelet, or a watch with an engraved message marks the milestone with lasting significance.</p>
<p><strong>Just-because gifts</strong> are often the most cherished. A simple pair of hoops, a dainty ring, or a layered necklace says "I was thinking of you" in the most elegant way possible.</p>
<p>Whatever the occasion, remember: the best jewelry gift is one that reflects her style, not yours. Observe what she already wears, and choose something that will complement her collection.</p>`,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=1200',
    category: 'Gift Ideas',
    author: 'ccjaouhara Atelier',
    date: '2026-03-05',
    tags: ['gift guide', 'occasions', 'birthday', 'anniversary', 'wedding'],
  },
  {
    id: 'blog-6',
    title: 'Birthstone Jewelry: A Personalised Touch',
    slug: 'birthstone-jewelry-guide',
    excerpt: 'Discover the meaning behind each birthstone and how to incorporate them into your everyday style.',
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
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200',
    category: 'Gift Ideas',
    author: 'ccjaouhara Atelier',
    date: '2026-02-14',
    tags: ['birthstone', 'gemstones', 'personalized', 'guide'],
  },
  {
    id: 'blog-7',
    title: 'How to Clean and Store Your Gold Jewelry',
    slug: 'clean-store-gold-jewelry',
    excerpt: 'Keep your precious pieces sparkling with our professional care guide for gold jewelry maintenance.',
    content: `<p>Gold jewelry is an investment that can last a lifetime — but only with proper care. Regular cleaning and correct storage are essential to maintaining its luminous beauty. Here's how to keep your pieces looking as radiant as the day you received them.</p>
<p><strong>Gentle cleaning at home:</strong> Mix a few drops of mild dish soap with warm water. Soak your gold pieces for 10-15 minutes, then gently brush with a soft-bristled toothbrush. Rinse thoroughly and pat dry with a lint-free cloth. Avoid paper towels, which can scratch the surface.</p>
<p><strong>What to avoid:</strong> Never use harsh chemicals, bleach, or abrasive cleaners. Chlorine and saltwater can damage gold over time, so remove your jewelry before swimming. Similarly, avoid exposing your pieces to perfumes, lotions, and hairsprays — apply these first, then put on your jewelry.</p>
<p><strong>Storage matters:</strong> Store each piece separately to prevent scratching. Use a soft jewelry pouch or a lined jewelry box with individual compartments. Keep your collection away from direct sunlight and humidity, which can tarnish silver and dull gemstones.</p>
<p><strong>Professional maintenance:</strong> Have your pieces professionally inspected once a year. A jeweler can check for loose settings, worn clasps, and signs of wear that need attention. Regular maintenance prevents small issues from becoming costly repairs.</p>
<p>With proper care, your gold jewelry will remain a source of joy and elegance for generations to come.</p>`,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    category: 'Jewelry Care',
    author: 'ccjaouhara Atelier',
    date: '2026-03-12',
    tags: ['care', 'cleaning', 'storage', 'gold', 'maintenance'],
  },
  {
    id: 'blog-8',
    title: '5 Mistakes That Ruin Your Jewelry',
    slug: 'jewelry-care-mistakes',
    excerpt: 'Avoid these common jewelry care mistakes that can tarnish, scratch, or damage your precious pieces.',
    content: `<p>Even the most beautiful jewelry can lose its lustre with improper care. We've identified the five most common mistakes that accelerate wear and tear — and how to avoid them.</p>
<p><strong>1. Wearing jewelry in the shower.</strong> Soap, shampoo, and conditioner leave a film that dulls the shine of gold and gemstones. The moisture also weakens clasps and stretches chains over time. Always remove your jewelry before washing.</p>
<p><strong>2. Sleeping in your pieces.</strong> Your movements during sleep can bend prongs, loosen stones, and tangle chains. Make it a habit to remove your jewelry before bed and store it properly.</p>
<p><strong>3. Using ultrasonic cleaners on delicate pieces.</strong> While convenient, ultrasonic cleaners can damage fragile gemstones like pearls, opals, and emeralds. Stick to gentle hand cleaning for these pieces.</p>
<p><strong>4. Storing pieces all together.</strong> Throwing all your jewelry into one box invites scratches and tangles. Harder gemstones like diamonds can scratch softer metals like gold. Separate each piece in its own compartment or pouch.</p>
<p><strong>5. Ignoring worn clasps and settings.</strong> A loose clasp or prong is an accident waiting to happen. If you notice any sign of wear, take your piece to a jeweler immediately. Prevention is far less costly than replacement.</p>
<p>By avoiding these common pitfalls, your jewelry will maintain its brilliance and structural integrity for years to come.</p>`,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a307c1db?auto=format&fit=crop&q=80&w=1200',
    category: 'Jewelry Care',
    author: 'ccjaouhara Atelier',
    date: '2026-02-18',
    tags: ['care', 'mistakes', 'maintenance', 'prevention'],
  },
  {
    id: 'blog-9',
    title: 'From Desk to Dinner: Jewelry That Transitions',
    slug: 'desk-to-dinner-jewelry',
    excerpt: 'Discover versatile pieces that take you seamlessly from the boardroom to an evening out without missing a beat.',
    content: `<p>The modern woman's life is multifaceted — and her jewelry should be too. Pieces that transition effortlessly from day to night are essential for those who move from professional meetings to social engagements without skipping a beat.</p>
<p><strong>The power of convertible pieces.</strong> Look for earrings with detachable drops, necklaces with adjustable lengths, and rings that can be worn solo or stacked. A single versatile piece can create multiple looks, making it a smart investment.</p>
<p><strong>Daytime strategy:</strong> For the office, opt for refined minimalism. Small hoops, a simple pendant, and a classic watch convey professionalism without distraction. Choose pieces that sit close to the body and won't catch on fabrics or equipment.</p>
<p><strong>Evening transformation:</strong> As the workday ends, add layers and drama. Clip on statement drops, stack your rings, and add a second or third necklace. The same foundation pieces become something entirely new with a few strategic additions.</p>
<p><strong>Essential transition pieces:</strong> A pair of diamond studs works for every occasion. A simple gold chain can be worn alone by day and layered by night. A classic bangle or cuff adds polish to any look.</p>
<p>The key to seamless transitions is choosing quality foundational pieces that can be dressed up or down. Invest in versatility, and your jewelry box will work as hard as you do.</p>`,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=1200',
    category: "Women's Style",
    author: 'ccjaouhara Atelier',
    date: '2026-03-08',
    tags: ['versatile', 'transition', 'day-to-night', 'style'],
  },
  {
    id: 'blog-10',
    title: 'The Power of Statement Earrings',
    slug: 'power-of-statement-earrings',
    excerpt: 'Why bold earrings are the ultimate confidence booster and how to choose the perfect pair for your face shape.',
    content: `<p>There's something transformative about a pair of statement earrings. They frame the face, catch the light, and announce your presence before you speak a word. In the world of jewelry, few pieces have the immediate impact of bold earrings.</p>
<p><strong>Why they work:</strong> Statement earrings draw attention upward, highlighting your eyes and cheekbones. They create a focal point that elevates even the simplest outfit — a white shirt and jeans become a curated look with the right pair.</p>
<p><strong>Choosing for your face shape:</strong> Round faces benefit from angular, elongated designs that create vertical lines. Oval faces can wear almost any style, from hoops to drops to studs. Heart-shaped faces are balanced by wider bottom-heavy designs. Square faces are softened by rounded, organic shapes.</p>
<p><strong>Material matters:</strong> Gold statement earrings offer warmth and versatility. Silver and white gold provide a cooler, contemporary edge. Mixed-metal designs offer maximum flexibility for pairing with other pieces.</p>
<p><strong>When to wear them:</strong> The beauty of statement earrings is that they're appropriate for almost any occasion — from brunch with friends to evening galas. The key is matching the scale to the setting. Save the most dramatic pieces for occasions where you want to make an impression.</p>
<p>Your ears are the perfect canvas for self-expression. Choose earrings that speak to your personality, and wear them with the confidence they deserve.</p>`,
    image: 'https://images.unsplash.com/photo-1629224307470-990cc8760221?auto=format&fit=crop&q=80&w=1200',
    category: "Women's Style",
    author: 'ccjaouhara Atelier',
    date: '2026-02-25',
    tags: ['earrings', 'statement', 'style', 'confidence'],
  },
  {
    id: 'blog-11',
    title: 'Introducing the Sahara Collection',
    slug: 'sahara-collection-launch',
    excerpt: 'Our newest collection draws inspiration from the golden dunes and rich heritage of Morocco.',
    content: `<p>We are proud to unveil the Sahara Collection — a celebration of the timeless beauty and cultural richness of Morocco. Inspired by the sweeping golden dunes, the intricate patterns of traditional architecture, and the warm, luminous light of the desert, this collection is our most personal yet.</p>
<p><strong>The inspiration:</strong> Morocco has always been a source of wonder for us. The way light plays across the sand, the geometric precision of zellij tilework, the deep indigos and warm terracottas of the souks — every element of the Sahara Collection reflects a piece of this landscape.</p>
<p><strong>The craftsmanship:</strong> Each piece is hand-finished by master artisans using techniques passed down through generations. We've combined traditional Moroccan filigree with contemporary silhouettes to create jewelry that feels both heritage-rich and thoroughly modern.</p>
<p><strong>The materials:</strong> The Sahara Collection features 14k and 18k gold, sterling silver, and ethically sourced gemstones including carnelian, turquoise, and mother of pearl — each chosen for its connection to the Moroccan palette.</p>
<p><strong>The pieces:</strong> From crescent-shaped pendants that echo the desert moon to cuff bracelets engraved with geometric motifs, every item in the collection tells a story. These are pieces designed to be worn, cherished, and passed down.</p>
<p>The Sahara Collection is now available exclusively at ccjaouhara. We invite you to discover the magic of Morocco, reimagined for the modern woman.</p>`,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    category: 'New Collections',
    author: 'ccjaouhara Atelier',
    date: '2026-03-20',
    tags: ['sahara', 'collection', 'morocco', 'launch', 'new'],
  },
  {
    id: 'blog-12',
    title: 'Behind the Design: Moroccan Heritage',
    slug: 'behind-design-moroccan-heritage',
    excerpt: 'Step into our creative process and discover how traditional Moroccan artistry shapes our latest designs.',
    content: `<p>Every piece in our collection begins with a story. For us, that story is deeply rooted in the rich artistic heritage of Morocco — a country where craftsmanship is not just a trade, but a way of life passed down through generations.</p>
<p><strong>The art of filigree:</strong> Moroccan filigree is a meticulous craft that involves twisting and soldering fine threads of gold and silver into intricate patterns. This technique, perfected over centuries in the medinas of Fez and Marrakech, produces lace-like metalwork of astonishing detail.</p>
<p><strong>Geometric inspiration:</strong> Islamic geometric patterns, found in Morocco's most treasured architecture, inform many of our designs. The repeating stars, interlocking circles, and rhythmic polygons are translated into jewelry that captures the mathematical beauty of traditional zellij and carved stucco.</p>
<p><strong>Colour palette:</strong> The colours of Morocco are unmistakable — the deep blue of Chefchaouen, the terracotta of Aït Benhaddou, the gold of the Sahara, the green of the Atlas valleys. These hues guide our gemstone selections and metal choices.</p>
<p><strong>Modern interpretation:</strong> While we honor traditional techniques, our designs are thoroughly contemporary. We distill centuries of artistry into clean, wearable forms that complement modern lifestyles. The result is jewelry that bridges past and present.</p>
<p>Every ccjaouhara piece carries a piece of Morocco's soul. We're proud to share our heritage with women around the world.</p>`,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    category: 'New Collections',
    author: 'ccjaouhara Atelier',
    date: '2026-03-18',
    tags: ['morocco', 'heritage', 'design', 'craftsmanship', 'inspiration'],
  },
];
