import { SentenceItem } from '../../types';

export const SHOPPING_SENTENCES: SentenceItem[] = [
  {
    id: 'shp-01',
    category: 'shopping',
    level: 'beginner',
    bn: 'এটার দাম কত?',
    enPrimary: 'How much is this?',
    enAlternatives: [
      'What is the price of this?',
      'How much does this cost?',
      'What does this cost?',
      'How much for this?'
    ],
    grammarTipBn: 'কোনো জিনিসের দাম জানার জন্য "How much is this?" সবচেয়ে স্বাভাবিক ও বহুল ব্যবহৃত প্রশ্ন।',
    explanationBn: '"How much" দিয়ে অপরিমাপযোগ্য বস্তু বা সামগ্রিক মূল্য জানতে চাওয়া হয়।',
    commonMistakeBn: '"How much price of this?" বলা ভুল; "What is the price" অথবা "How much is this" বলতে হবে।'
  },
  {
    id: 'shp-02',
    category: 'shopping',
    level: 'beginner',
    bn: 'দয়া করে আমাকে দুই কেজি আলু দিন।',
    enPrimary: 'Please give me two kilograms of potatoes.',
    enAlternatives: [
      'Give me two kilos of potatoes, please.',
      'Can I get two kilos of potatoes, please?',
      'I would like two kilos of potatoes, please.'
    ],
    grammarTipBn: 'পরিমাণ ও বস্তুর মধ্যে preposition "of" বসে (two kilos of potatoes)। আলু বহুবচন থাকায় "potatoes" (es)।',
    explanationBn: 'দোকানে চাওয়ার সময় "Can I get..." বা "Please give me..." ভদ্র প্রকাশ।',
    commonMistakeBn: '"Give two kilo potato" - বহুবচন plural s/es এবং preposition of বাদ দেওয়া যাবে না।'
  },
  {
    id: 'shp-03',
    category: 'shopping',
    level: 'beginner',
    bn: 'আপনারা কি কার্ডে পেমেন্ট নেন?',
    enPrimary: 'Do you accept card payments?',
    enAlternatives: [
      'Do you accept cards?',
      'Can I pay by card?',
      'Do you take credit cards?',
      'Can I pay with card?'
    ],
    grammarTipBn: 'কার্ডে বিল পরিশোধে preposition "by card" বা "with a card" বসে।',
    explanationBn: 'দোকানদারকে জিজ্ঞাসা করার সময় "Do you accept card payments?" অত্যন্ত মার্জিত।',
    commonMistakeBn: '"Do you take card?" অনানুষ্ঠানিক হলেও চলে, তবে "Do you accept cards?" সেরা।'
  },
  {
    id: 'shp-04',
    category: 'shopping',
    level: 'beginner',
    bn: 'দামটি অনেক বেশি মনে হচ্ছে।',
    enPrimary: 'The price seems a bit too high.',
    enAlternatives: [
      'It seems quite expensive.',
      'The price feels too steep.',
      'This is too pricey.',
      'It looks very expensive.'
    ],
    grammarTipBn: '"Seem + adjective" গঠন: কোনো কিছু কেমন মনে হচ্ছে তা বর্ণনা করতে ব্যবহৃত হয়।',
    explanationBn: '"Steep" বা "pricey" বেশি দামের কথ্য ইংরেজি শব্দ।',
    commonMistakeBn: '"Price is too much" এর চেয়ে "The price seems too high" মার্জিত।'
  },
  {
    id: 'shp-05',
    category: 'shopping',
    level: 'beginner',
    bn: 'আপনি কি কিছু দাম কম রাখতে পারেন?',
    enPrimary: 'Can you give a discount?',
    enAlternatives: [
      'Could you offer any discount?',
      'Can you lower the price a bit?',
      'Is there any room for a discount?',
      'Could you reduce the price a little?'
    ],
    grammarTipBn: 'অনুরোধ করার ক্ষেত্রে "Could you..." "Can you..." এর চেয়ে বেশি ভদ্র।',
    explanationBn: 'মূল্যছাড়ের জন্য "offer a discount" বা "lower the price" প্রচলিত।',
    commonMistakeBn: '"Can you discount something?" এর বদলে "Can you give a discount?" বলুন।'
  },
  {
    id: 'shp-06',
    category: 'shopping',
    level: 'beginner',
    bn: 'আমি শুধু দেখছি, ধন্যবাদ।',
    enPrimary: 'I am just browsing, thank you.',
    enAlternatives: [
      "I'm just looking around, thanks.",
      'Just browsing, thank you.',
      "I'm just having a look, thanks."
    ],
    grammarTipBn: 'দোকানে কেনাকাটা না করে কেবল ঘুরে দেখার ইংরেজি হলো "browse" বা "look around"।',
    explanationBn: 'দোকানের সেলসম্যান কাছে এলে ভদ্রভাবে বলতে পারেন: "I\'m just browsing, thank you."।',
    commonMistakeBn: '"I only seeing" ভুল; সঠিক ইংরেজি হলো "just browsing"।'
  },
  {
    id: 'shp-07',
    category: 'shopping',
    level: 'beginner',
    bn: 'ট্রায়াল রুমটি কোন দিকে?',
    enPrimary: 'Where is the trial room?',
    enAlternatives: [
      'Where is the fitting room?',
      'Where are the changing rooms?',
      'Could you tell me where the fitting room is?'
    ],
    grammarTipBn: 'পোশাক পরে দেখার স্থানকে আন্তর্জাতিকভাবে "fitting room" বা "changing room" বলা হয় (বাংলাদেশে ট্রায়াল রুমও চলে)।',
    explanationBn: 'স্থান নির্দেশক ডব্লিউএইচ প্রশ্ন: "Where is..."।',
    commonMistakeBn: '"Trial room where?" অক্সিলারি ভার্ব বাদ দিয়ে প্রশ্ন করা অপভাষা।'
  },
  {
    id: 'shp-08',
    category: 'shopping',
    level: 'beginner',
    bn: 'আপনার কাছে কি এটার বড় সাইজ আছে?',
    enPrimary: 'Do you have this in a larger size?',
    enAlternatives: [
      'Do you have this in a bigger size?',
      'Is this available in a large size?',
      'Do you have a bigger one of this?'
    ],
    grammarTipBn: 'নির্দিষ্ট কোনো রঙ বা সাইজের ক্ষেত্রে preposition "in" বসে (e.g. in a larger size, in blue)।',
    explanationBn: '"Do you have this in..." হলো কেনাকাটার সময় পণ্য খোঁজার স্ট্যান্ডার্ড গঠন।',
    commonMistakeBn: '"Do you have this large size?" প্রিপজিশন "in" বাদ দেওয়া যাবে না।'
  },
  {
    id: 'shp-09',
    category: 'shopping',
    level: 'beginner',
    bn: 'আমাকে একটি রসিদ দিন।',
    enPrimary: 'Please give me a receipt.',
    enAlternatives: [
      'Can I get a receipt, please?',
      'Could you give me a receipt?',
      'I would like a receipt, please.'
    ],
    grammarTipBn: '"Receipt" বানানে p অনুচ্চারিত (silent), উচ্চারণ হলো: "রিসীট" (ri-seet)।',
    explanationBn: 'টাকা প্রদানের প্রমাণপত্রকে "receipt" বলা হয়।',
    commonMistakeBn: 'Receipt-কে "রিসিপ্ট" উচ্চারণ করা ভুল; p এর উচ্চারণ হবে না।'
  },
  {
    id: 'shp-10',
    category: 'shopping',
    level: 'beginner',
    bn: 'আমি নগদে টাকা পরিশোধ করব।',
    enPrimary: 'I will pay in cash.',
    enAlternatives: [
      "I'll pay with cash.",
      "I'm paying cash.",
      'I will pay by cash.'
    ],
    grammarTipBn: 'নগদ অর্থে বিল পরিশোধের জন্য "in cash" বা "with cash" বসে।',
    explanationBn: 'Future Simple: "will pay"।',
    commonMistakeBn: '"I will pay cash money" - "money" শব্দটির কোনো প্রয়োজন নেই।'
  },
  {
    id: 'shp-11',
    category: 'shopping',
    level: 'intermediate',
    bn: 'এই শার্টটি কি ধোয়ার পর রঙ উঠে যাবে?',
    enPrimary: 'Will the color of this shirt fade after washing?',
    enAlternatives: [
      'Does the color bleed when washed?',
      'Will this shirt lose color after a wash?',
      'Is the fabric colorfast?'
    ],
    grammarTipBn: 'রঙ বিবর্ণ হওয়ার ইংরেজি "fade" এবং রঙ ছড়িয়ে যাওয়ার ক্ষেত্রে "bleed" ব্যবহৃত হয়।',
    explanationBn: '"Colorfast" অর্থ যে কাপড়ের রঙ সহজে নষ্ট হয় না।',
    commonMistakeBn: '"Will color fly?" আক্ষরিক অনুবাদের ভুল; "fade" বা "bleed" বলতে হবে।'
  },
  {
    id: 'shp-12',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আপনার দোকানে কি পণ্য পরিবর্তনের সুযোগ রয়েছে?',
    enPrimary: 'What is your exchange policy?',
    enAlternatives: [
      'Do you offer an exchange policy?',
      'Can I exchange this if the size does not fit?',
      'Do you have a return and exchange policy?'
    ],
    grammarTipBn: 'দোকানের পণ্য বদল বা ফেরতের নিয়মাবলীকে "exchange policy" বা "return policy" বলা হয়।',
    explanationBn: '"What is your exchange policy?" সংক্ষিপ্ত, ভদ্র ও প্রমিত ইংরেজি।',
    commonMistakeBn: '"If size no fit, exchange have?" অশুদ্ধ।'
  },
  {
    id: 'shp-13',
    category: 'shopping',
    level: 'intermediate',
    bn: 'এই পণ্যটির ওয়ারেন্টি মেয়াদ কতদিন?',
    enPrimary: 'How long is the warranty period for this product?',
    enAlternatives: [
      'What is the warranty period on this item?',
      'How much warranty does this product come with?',
      'Does this product have a warranty?'
    ],
    grammarTipBn: 'সময়ের দৈর্ঘ্য জানতে "How long" ব্যবহার করা হয়। Warranty-এর পর preposition "for" বা "on" বসে।',
    explanationBn: '"Come with a warranty" একটি চমৎকার কলোকেশন।',
    commonMistakeBn: '"How many time warranty?" ভুল; How long বসবে।'
  },
  {
    id: 'shp-14',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আমি অনলাইন থেকে কেনাকাটা করতে বেশি স্বাচ্ছন্দ্যবোধ করি।',
    enPrimary: 'I feel more comfortable shopping online.',
    enAlternatives: [
      'I prefer shopping online rather than going to malls.',
      'I find online shopping more convenient.',
      'I prefer purchasing things online.'
    ],
    grammarTipBn: '"Feel comfortable doing something" গঠন। Online নিজেই adverb হওয়ায় "in online" বলা ভুল।',
    explanationBn: '"Shopping online" মানে অনলাইনে কেনাকাটা করা।',
    commonMistakeBn: '"I like shopping in online" ভুল; preposition "in" বাদ দিয়ে "shopping online" বলতে হবে।'
  },
  {
    id: 'shp-15',
    category: 'shopping',
    level: 'intermediate',
    bn: 'দোকানদার আমাকে নকল পণ্য ধরিয়ে দেওয়ার চেষ্টা করছিল।',
    enPrimary: 'The shopkeeper was trying to palm off a counterfeit product onto me.',
    enAlternatives: [
      'The vendor was trying to sell me a fake item.',
      'The seller attempted to hand me a duplicate product.',
      'The store clerk tried to sell me a counterfeit product.'
    ],
    grammarTipBn: '"Palm off something onto someone" একটি চমৎকার Phrasal verb যার অর্থ ধোঁকা দিয়ে কোনো ভুয়া জিনিস কারো ঘাড়ে চাপিয়ে দেওয়া।',
    explanationBn: '"Counterfeit" অর্থ আসল পণ্যের নকল বা জাল কপি।',
    commonMistakeBn: '"give two number product" বাংলা গালিগালাজ; ইংরেজিতে "counterfeit" বা "fake" বলতে হবে।'
  },
  {
    id: 'shp-16',
    category: 'shopping',
    level: 'intermediate',
    bn: 'দামাদামি করা আমার একদম ভালো লাগে না।',
    enPrimary: 'I really do not like haggling over prices.',
    enAlternatives: [
      "I dislike bargaining over prices.",
      "I'm not a fan of haggling.",
      'Bargaining is something I genuinely dislike.'
    ],
    grammarTipBn: 'দোকানে দামাদামি করার ইংরেজি "haggle" বা "bargain"। Preposition হিসেবে "over prices" বসে।',
    explanationBn: '"Not a fan of..." কোনো কিছু অপছন্দ করার বিনয়ী অভিব্যক্তি।',
    commonMistakeBn: '"I don\'t like doing price low" অপভাষা।'
  },
  {
    id: 'shp-17',
    category: 'shopping',
    level: 'intermediate',
    bn: 'এই জুতোজোড়া আমার পায়ে একদম পারফেক্ট মাপ হয়েছে।',
    enPrimary: 'This pair of shoes fits me like a glove.',
    enAlternatives: [
      'These shoes fit me perfectly.',
      'This pair of shoes fits me like a charm.',
      'These shoes are a perfect fit for me.'
    ],
    grammarTipBn: '"Fit like a glove" একটি জনপ্রিয় ইংরেজি ইডিয়ম যার অর্থ কোনো পোশাক বা জুতো নিখুঁতভাবে মাপসই হওয়া।',
    explanationBn: 'Subject "This pair" singular হওয়ায় verb "fits" হয়েছে। আর "These shoes" লিখলে plural verb "fit" হবে।',
    commonMistakeBn: '"These shoes fits" - plural subject-এর সাথে s যুক্ত verb হবে না।'
  },
  {
    id: 'shp-18',
    category: 'shopping',
    level: 'intermediate',
    bn: 'উৎসবের মৌসুমে প্রায় সব শোরুমেই বিশেষ ছাড় পাওয়া যায়।',
    enPrimary: 'During festive seasons, almost all showrooms offer special discounts.',
    enAlternatives: [
      'Special discounts are available in nearly all outlets during festive seasons.',
      'Most stores roll out special discounts during festival periods.',
      'You can find festive discounts across almost all outlets.'
    ],
    grammarTipBn: '"Roll out discounts" মানে আনুষ্ঠানিকভাবে ছাড় ঘোষণা করা বা দেওয়া।',
    explanationBn: 'নির্দিষ্ট উৎসবের সময় বোঝাতে "during festive seasons" বসে।',
    commonMistakeBn: '"In Eid time discount have" অপূর্ণাঙ্গ বাক্য।'
  },
  {
    id: 'shp-19',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আমি কি বিকাশ বা নগদে টাকা পাঠাতে পারি?',
    enPrimary: 'Can I pay via bKash or Nagad?',
    enAlternatives: [
      'Do you accept mobile financial services like bKash or Nagad?',
      'Can I make the payment through bKash or Nagad?',
      'Do you take bKash or Nagad?'
    ],
    grammarTipBn: 'কোনো মাধ্যম বা প্ল্যাটফর্ম বোঝাতে preposition "via" বা "through" ব্যবহৃত হয়।',
    explanationBn: 'বাংলাদেশের প্রেক্ষাপটে মোবাইল ফিন্যান্সিয়াল সার্ভিসের জন্য "via bKash" স্ট্যান্ডার্ড ব্যবহার।',
    commonMistakeBn: '"Can I send bKash?" দোকানে বিলের ক্ষেত্রে "pay via bKash" মার্জিত।'
  },
  {
    id: 'shp-20',
    category: 'shopping',
    level: 'intermediate',
    bn: 'মাছটি তাজা তো? নাকি বরফে রাখা অনেক আগের?',
    enPrimary: 'Is the fish fresh, or has it been frozen for a long time?',
    enAlternatives: [
      'Is this fish fresh or frozen?',
      'Is the fish freshly caught, or is it iced?',
      'Is this fresh catch or preserved on ice?'
    ],
    grammarTipBn: 'বিকল্প জানতে "or" দিয়ে দুটি অংশ যুক্ত হয়েছে। "Has it been frozen" হলো Present Perfect Passive।',
    explanationBn: 'বরফের মাছকে ইংরেজিতে "frozen fish" বা "iced fish" বলা হয়।',
    commonMistakeBn: '"Ice fish or alive fish?" আক্ষরিক অনুবাদের ভুল।'
  },
  {
    id: 'shp-21',
    category: 'shopping',
    level: 'advanced',
    bn: 'অবাঞ্ছিত কেনাকাটা এড়াতে বাজারে যাওয়ার আগে কেনাকাটার ফর্দ প্রস্তুত করা বুদ্ধিমানের কাজ।',
    enPrimary: 'Drafting a shopping list prior to hitting the market is prudent to avert impulse buying.',
    enAlternatives: [
      'Preparing a grocery list in advance is a smart way to curb impulsive purchases.',
      'Making a shopping list before heading to the market helps prevent wasteful impulse buys.',
      'It is advisable to make a shopping list to prevent spontaneous spending.'
    ],
    grammarTipBn: 'আবেগের বশে হুটহাট কেনাকাটাকে অর্থনীতি ও বিজ্ঞাপনী ভাষায় "impulse buying" বলা হয়।',
    explanationBn: '"Prudent" অর্থ বিচক্ষণ বা দূরদর্শী। "Avert" বা "curb" অর্থ নিবৃত্ত করা বা প্রতিহত করা।',
    commonMistakeBn: '"extra buying" এর বদলে পরিশীলিত ইংরেজি "impulse buying" ব্যবহার করুন।'
  },
  {
    id: 'shp-22',
    category: 'shopping',
    level: 'advanced',
    bn: 'উৎপাদন ও মেয়াদের তারিখ যাচাই না করে কোনো মোড়কজাত খাদ্যদ্রব্য কেনা উচিত নয়।',
    enPrimary: 'No packaged food item should be purchased without verifying the manufacturing and expiration dates.',
    enAlternatives: [
      'Consumers ought to inspect both the manufacturing and expiry dates before buying packaged groceries.',
      'It is ill-advised to purchase packaged consumables without checking their expiration dates.',
      'Always inspect the manufacturing and expiry dates on packaged foods before making a purchase.'
    ],
    grammarTipBn: 'Passive voice: "should be purchased without verifying..."।',
    explanationBn: '"Packaged consumables" বা "packaged food items" অর্থ প্যাকেটজাত খাদ্যপণ্য।',
    commonMistakeBn: '"date verify" ছাড়া সরাসরি কেনা এড়াতে "without verifying" প্রিপজিশনাল ব্যবহার লক্ষ্য করুন।'
  },
  {
    id: 'shp-23',
    category: 'shopping',
    level: 'advanced',
    bn: 'ভোক্তা অধিকার সংরক্ষণ আইন সাধারণ ক্রেতাদের প্রতারণার হাত থেকে আইনি সুরক্ষা প্রদান করে।',
    enPrimary: 'The Consumer Rights Protection Act provides statutory safeguards against fraudulent retail practices.',
    enAlternatives: [
      'Consumer rights laws grant legal protection to buyers against unfair trade practices.',
      'The consumer protection act shields consumers from deceptive commercial tactics.',
      'Statutory regulations protect consumers from unethical merchant exploitation.'
    ],
    grammarTipBn: '"Statutory safeguards" অর্থ সংবিধিবদ্ধ বা আইনসম্মত সুরক্ষা ব্যবস্থা।',
    explanationBn: '"Fraudulent practices" মানে প্রতারণামূলক কার্যকলাপ বা জালিয়াতি।',
    commonMistakeBn: '"law saves buyers" অতি শিশুসুলভ বাক্য; প্রাতিষ্ঠানিক ইংরেজি গঠন চর্চা করুন।'
  },
  {
    id: 'shp-24',
    category: 'shopping',
    level: 'advanced',
    bn: 'চটকদার বিজ্ঞাপনে প্রলুব্ধ না হয়ে পণ্যের গুণগত মান বিশ্লেষণ করে কেনাকাটা করা শ্রেয়।',
    enPrimary: 'Rather than being swayed by flashy advertisements, one should evaluate the intrinsic quality of the product.',
    enAlternatives: [
      'Instead of succumbing to seductive ads, consumers should scrutinize the actual quality of items.',
      'Shoppers ought to assess the substantive value of goods instead of falling for glitzy promotional hype.',
      'It is wiser to judge a product by its craftsmanship rather than flashy marketing campaigns.'
    ],
    grammarTipBn: '"Be swayed by" মানে কারো প্ররোচনায় প্রভাবিত হওয়া। "Intrinsic quality" মানে সহজাত গুণমান।',
    explanationBn: '"Succumb to" মানে কোনো লোভনীয় প্রলোভনে নতি স্বীকার করা।',
    commonMistakeBn: '"cheated by nice advertisement" এর চেয়ে "swayed by flashy advertisements" শতগুণ সমৃদ্ধ।'
  },
  {
    id: 'shp-25',
    category: 'shopping',
    level: 'advanced',
    bn: 'ই-কমার্সের দ্রুত প্রসারের ফলে সনাতনী খুচরা বাজার এক তীব্র প্রতিযোগিতার মুখে পড়েছে।',
    enPrimary: 'The exponential boom of e-commerce has plunged traditional brick-and-mortar stores into fierce competition.',
    enAlternatives: [
      'The rapid expansion of online retail has subjected traditional storefronts to stiff market competition.',
      'Due to the surge in digital shopping, brick-and-mortar retailers face intense commercial rivalry.',
      'E-commerce proliferation has created fierce competition for traditional physical markets.'
    ],
    grammarTipBn: 'বাস্তব ভৌত দোকানকে ইংরেজিতে "brick-and-mortar stores" রূপক হিসেবে ডাকা হয়।',
    explanationBn: '"Exponential boom" মানে অবিশ্বাস্য দ্রুত প্রবৃদ্ধি। "Plunged into" মানে নিমজ্জিত করা।',
    commonMistakeBn: '"Online shop make road shop hard" অপভ্রংশ বাক্য।'
  },
  {
    id: 'shp-26',
    category: 'shopping',
    level: 'beginner',
    bn: 'এই কাপড়টি কি খাঁটি সুতির?',
    enPrimary: 'Is this fabric pure cotton?',
    enAlternatives: [
      'Is this material one hundred percent cotton?',
      'Is this made of pure cotton?',
      'Is this cloth 100% cotton?'
    ],
    grammarTipBn: 'কোনো উপাদান দিয়ে তৈরি বোঝাতে "made of + material" বসে।',
    explanationBn: 'কাপড়ের উপাদানকে "fabric" বা "material" বলা হয়।',
    commonMistakeBn: '"Is this pure cotton cloth?" ও চলে, তবে "pure cotton fabric" বেশি প্রমিত।'
  },
  {
    id: 'shp-27',
    category: 'shopping',
    level: 'beginner',
    bn: 'দয়া করে এটি একটি ব্যাগে ভরে দিন।',
    enPrimary: 'Please put this in a shopping bag.',
    enAlternatives: [
      'Could you bag this for me, please?',
      'Please pack this in a carry bag.',
      'Can I get a bag for this, please?'
    ],
    grammarTipBn: '"Bag" এখানে verb হিসেবেও ব্যবহার করা যায়: "Could you bag this for me?"।',
    explanationBn: 'দোকানে কেনা জিনিসপত্র বহনের ব্যাগ হলো "shopping bag" বা "carry bag"।',
    commonMistakeBn: '"Give it inside bag" ভাঙা ইংরেজি।'
  },
  {
    id: 'shp-28',
    category: 'shopping',
    level: 'beginner',
    bn: 'এখানে কি কোনো ছাড় চলছে?',
    enPrimary: 'Is there any ongoing sale here?',
    enAlternatives: [
      'Are there any discounts running currently?',
      'Is there a discount sale going on?',
      'Do you have any promotional offers right now?'
    ],
    grammarTipBn: 'চলমান বিক্রি বা অফার বোঝাতে "ongoing sale" বা "sale going on" ব্যবহৃত হয়।',
    explanationBn: 'প্রশ্নবোধক বাক্য: "Is there..."।',
    commonMistakeBn: '"Any discount going?" অক্সিলারি ভার্ব বাদ দিয়ে প্রশ্ন করা পরিহার করুন।'
  },
  {
    id: 'shp-29',
    category: 'shopping',
    level: 'beginner',
    bn: 'বাকি টাকা বা ভাংতি ফেরত দিন।',
    enPrimary: 'Please give me the change.',
    enAlternatives: [
      'Could you return my change, please?',
      'Here is the money, please hand me the change.',
      'My change, please.'
    ],
    grammarTipBn: 'খুচরা বা ফেরত পাওয়ার বাড়তি টাকাকে ইংরেজিতে "change" বলা হয়।',
    explanationBn: '"Keep the change" মানে বাকি খুচরা টাকা রেখে দিন (টিপস হিসেবে)। ফেরত চাইলে "give me the change"।',
    commonMistakeBn: '"Give back my rest money" মারাত্মক ভুল! বাকি টাকার ইংরেজি "change"।'
  },
  {
    id: 'shp-30',
    category: 'shopping',
    level: 'beginner',
    bn: 'আমি এটি কিনতে চাই।',
    enPrimary: 'I would like to buy this.',
    enAlternatives: [
      'I want to purchase this.',
      "I'll take this.",
      'I want to buy this one.'
    ],
    grammarTipBn: 'দোকানে কোনো জিনিস নিশ্চিত করার সবচেয়ে চমৎকার ও প্রচলিত কথ্য অভিব্যক্তি হলো "I\'ll take this"।',
    explanationBn: '"I would like to..." "I want to" এর চেয়ে অধিক মার্জিত।',
    commonMistakeBn: '"I buy this" বললে অভ্যাস বোঝায়; কেনার সিদ্ধান্ত জানাতে "I\'ll take this" বলুন।'
  },
  {
    id: 'shp-31',
    category: 'shopping',
    level: 'intermediate',
    bn: 'পণ্যটিতে কোনো ত্রুটি থাকলে কি তা বদল করে দেওয়া হবে?',
    enPrimary: 'If the item is defective, will it be replaced?',
    enAlternatives: [
      'Will you replace the product if there is any defect?',
      'In case of a defect, can this product be exchanged?',
      'If the product turns out faulty, do you offer a replacement?'
    ],
    grammarTipBn: 'First Conditional: "If + present simple, will + base verb / passive (will it be replaced)"।',
    explanationBn: '"Defective" বা "faulty" মানে কোনো ত্রুটিযুক্ত পণ্য।',
    commonMistakeBn: '"If product fault, will change?" ভাঙা ইংরেজি।'
  },
  {
    id: 'shp-32',
    category: 'shopping',
    level: 'intermediate',
    bn: 'এই জুতোটির অন্য কোনো রঙ আছে কি?',
    enPrimary: 'Does this pair of shoes come in any other colors?',
    enAlternatives: [
      'Do you have these shoes in different colors?',
      'Are other color variants available for this model?',
      'Is this shoe available in another shade?'
    ],
    grammarTipBn: 'পণ্য বিভিন্ন রঙে বা আকারে পাওয়া যাওয়ার কলোকেশন হলো "come in (colors/sizes)"।',
    explanationBn: '"Come in other colors" অত্যন্ত প্রাকৃতিক ও আন্তর্জাতিকভাবে প্রচলিত।',
    commonMistakeBn: '"Is other color having?" ভুল।'
  },
  {
    id: 'shp-33',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আমি নগদ টাকার বদলে কার্ডে মূল্য পরিশোধ করেছি।',
    enPrimary: 'I paid by card instead of paying in cash.',
    enAlternatives: [
      'I swiped my card instead of using cash.',
      'I used my card rather than paying cash.',
      'Instead of cash, I completed the payment with my card.'
    ],
    grammarTipBn: '"Instead of" একটি prepositional phrase, তাই এর পর gerund (-ing) বা noun বসে।',
    explanationBn: '"Swipe card" কার্ড ঘষে বিল দেওয়ার চমৎকার কথ্য পরিভাষা।',
    commonMistakeBn: '"instead of cash money" এর চেয়ে "instead of paying cash" সাবলীল।'
  },
  {
    id: 'shp-34',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আমি জামাটি পরে দেখেছি, কিন্তু হাতাগুলো একটু লম্বা।',
    enPrimary: 'I tried on the shirt, but the sleeves are a bit too long.',
    enAlternatives: [
      'I tried the dress on, but the sleeves seem a bit loose and long.',
      'I put on the shirt to check the fit, but the sleeves are somewhat long.',
      'The fit is fine except that the sleeves are slightly long.'
    ],
    grammarTipBn: 'পোশাক ট্রায়াল করার phrasal verb হলো "try on"।',
    explanationBn: 'পোশাকের হাতা হলো "sleeves" (বহুবচন)।',
    commonMistakeBn: '"I wear and see" আক্ষরিক বাংলা; "try on" ব্যবহার করতে হবে।'
  },
  {
    id: 'shp-35',
    category: 'shopping',
    level: 'intermediate',
    bn: 'সুপারশপে কেনাকাটা করলে সময় অনেক বাঁচে।',
    enPrimary: 'Shopping at a supermarket saves a significant amount of time.',
    enAlternatives: [
      'Doing groceries at a hypermarket saves plenty of time.',
      'Supermarket shopping is much more time-saving.',
      'Buying goods from a supermarket saves considerable time.'
    ],
    grammarTipBn: 'Gerund ("Shopping at a supermarket") singular subject, তাই verb হলো "saves"।',
    explanationBn: '"Significant amount of time" মানে উল্লেখযোগ্য পরিমাণ সময়।',
    commonMistakeBn: '"Supermarket buying save time" (Subject-Verb agreement ভুল)।'
  },
  {
    id: 'shp-36',
    category: 'shopping',
    level: 'advanced',
    bn: 'অনলাইন শপিংয়ে গ্রাহকদের মতামত ও রেটিং সঠিক সিদ্ধান্ত নিতে সহায়ক ভূমিকা পালন করে।',
    enPrimary: 'In online shopping, authentic customer reviews and ratings play an instrumental role in informed decision-making.',
    enAlternatives: [
      'Customer ratings and testimonials are crucial in guiding buyers toward smart choices in e-commerce.',
      'Genuine user reviews on digital marketplaces provide valuable guidance for discerning buyers.',
      'Authentic customer feedback plays a pivotal role when purchasing items online.'
    ],
    grammarTipBn: '"Play an instrumental role" কোনো ক্ষেত্রে অত্যন্ত কার্যকরী বা নিয়ামক ভূমিকা পালন করার দুর্দান্ত কলোকেশন।',
    explanationBn: '"Informed decision-making" মানে তথ্যভিত্তিক ও সচেতন সিদ্ধান্ত গ্রহণ।',
    commonMistakeBn: '"Reviews play good role" এর চেয়ে "play an instrumental role" অনেক বেশি আকর্ষণীয়।'
  },
  {
    id: 'shp-37',
    category: 'shopping',
    level: 'advanced',
    bn: 'উচ্চমানের কাঁচামাল ব্যবহারের কারণেই এই ব্র্যান্ডের পণ্যের দাম কিছুটা বেশি।',
    enPrimary: 'The premium pricing of this brand is justified by their use of superior-grade raw materials.',
    enAlternatives: [
      'Their use of top-tier raw materials justifies the premium price tag of this merchandise.',
      'The brand commands higher prices owing to its commitment to superior-quality ingredients.',
      'The high cost of this product is attributable to the impeccable quality of its raw materials.'
    ],
    grammarTipBn: '"Command a higher price" মানে উচ্চমূল্য দাবি করা বা নির্ধারণ করা। "Attributable to" মানে কোনো কারণে হওয়া।',
    explanationBn: '"Premium pricing" মানে বাজারদরের চেয়ে উন্নত বা অভিজাত মূল্য।',
    commonMistakeBn: '"For good material, price is big" অপূর্ণাঙ্গ ইংরেজি।'
  },
  {
    id: 'shp-38',
    category: 'shopping',
    level: 'advanced',
    bn: 'অতিরিক্ত কেনাকাটার মোহ মানুষকে আর্থিক টানাপোড়েনের দিকে ঠেলে দেয়।',
    enPrimary: 'Unrestrained consumerism often nudges individuals toward severe financial distress.',
    enAlternatives: [
      'The compulsive urge to overspend frequently plunges people into economic hardship.',
      'Uncontrolled consumerist habits inevitably lead to acute financial strain.',
      'Giving in to reckless spending habits can precipitate financial ruin.'
    ],
    grammarTipBn: '"Consumerism" মানে ভোগবাদ বা অতিরিক্ত কেনাকাটার সংস্কৃতি। "Financial distress" অর্থ অর্থনৈতিক সংকট।',
    explanationBn: '"Nudge toward" বা "plunge into" আলংকারিক verb যা পরিস্থিতির অবনতি প্রকাশ করে।',
    commonMistakeBn: '"More buying makes money problem" অতি সাধারণ ও অগম্ভীর প্রকাশ।'
  },
  {
    id: 'shp-39',
    category: 'shopping',
    level: 'beginner',
    bn: 'এই ফলগুলো কি মিষ্টি?',
    enPrimary: 'Are these fruits sweet?',
    enAlternatives: [
      'Is this fruit sweet?',
      'Are these mangoes sweet?',
      'How sweet are these fruits?'
    ],
    grammarTipBn: 'Plural demonstrative "these" এর সাথে plural verb "are" বসে।',
    explanationBn: 'ফল মিষ্টি কিনা তা সরাসরি দোকানদারকে জিজ্ঞাসা করার সহজ প্রশ্ন।',
    commonMistakeBn: '"This fruits is sweet?" (number agreement ভুল)।'
  },
  {
    id: 'shp-40',
    category: 'shopping',
    level: 'beginner',
    bn: 'আমার কাছে খুচরা টাকা নেই, বড় নোট রয়েছে।',
    enPrimary: 'I do not have change, I only have a large bill.',
    enAlternatives: [
      "I don't have exact change, only large notes.",
      "I don't have change, just big notes.",
      'I lack smaller denominations; I have only large bills.'
    ],
    grammarTipBn: 'টাকার বড় নোটকে "large bill" বা "large note" বলা হয়।',
    explanationBn: '"Exact change" মানে ঠিক হিসেবমতো খুচরা টাকা।',
    commonMistakeBn: '"I have no broken money" ভুল! খুচরা টাকার ইংরেজি change, broken money নয়।'
  },
  {
    id: 'shp-41',
    category: 'shopping',
    level: 'intermediate',
    bn: 'দোকানদার আমাকে মূল্যের ওপর ১০ শতাংশ ছাড় দিয়েছিলেন।',
    enPrimary: 'The shopkeeper gave me a ten percent discount on the purchase price.',
    enAlternatives: [
      'The store owner offered me a 10% discount on the marked price.',
      'I was given a 10 percent discount by the merchant.',
      'The vendor deducted ten percent from the total bill.'
    ],
    grammarTipBn: 'ছাড় নির্দেশক preposition হলো "on" (discount on the price)।',
    explanationBn: 'Simple Past: "gave me a ten percent discount"।',
    commonMistakeBn: '"discount in price" ভুল; discount-এর সাথে "on" বসে।'
  },
  {
    id: 'shp-42',
    category: 'shopping',
    level: 'intermediate',
    bn: 'পণ্যটির প্যাকেজিং ছেঁড়া থাকায় আমি এটি ফেরত দিয়েছি।',
    enPrimary: 'I returned the item because the packaging was damaged.',
    enAlternatives: [
      'Since the seal was broken, I returned the merchandise.',
      'I returned the product as its packaging was torn.',
      'Because of the damaged packaging, I sent the item back.'
    ],
    grammarTipBn: '"Because + clause (the packaging was damaged)" কারণ ব্যাখ্যা করছে।',
    explanationBn: '"Packaging" হলো মোড়ক। "Damaged" বা "torn" মানে ক্ষতিগ্রস্ত বা ছেঁড়া।',
    commonMistakeBn: '"packet was broken" এর চেয়ে "packaging was damaged" প্রমিত।'
  },
  {
    id: 'shp-43',
    category: 'shopping',
    level: 'intermediate',
    bn: 'অনলাইনে অর্ডার করার তিন দিনের মাথায় পার্সেলটি আমার বাসায় পৌঁছেছে।',
    enPrimary: 'The parcel was delivered to my doorstep within three days of ordering online.',
    enAlternatives: [
      'I received the parcel at my house three days after placing the online order.',
      'Within three days of ordering online, the parcel arrived at my doorstep.',
      'The shipment reached my residence within three days.'
    ],
    grammarTipBn: 'নির্দিষ্ট সময়সীমার মধ্যে কোনো কাজ সম্পন্ন হলে "within" বসে (within three days)।',
    explanationBn: '"Delivered to my doorstep" একটি আকর্ষণীয় প্রাতিষ্ঠানিক অভিব্যক্তি।',
    commonMistakeBn: '"in three days" এর চেয়ে নির্দিষ্ট মেয়াদের মধ্যে বোঝাতে "within three days" নিখুঁত।'
  },
  {
    id: 'shp-44',
    category: 'shopping',
    level: 'intermediate',
    bn: 'দাম নিয়ে একগুঁয়েমি না করে একটু ছাড় দিলে ভালো হতো।',
    enPrimary: 'Instead of being rigid about the price, offering a small discount would have been nice.',
    enAlternatives: [
      'It would have been better if the seller had shown some flexibility on the price.',
      'Rather than sticking strictly to the price, giving a slight discount would be appreciated.',
      'A little flexibility on the price would have been welcome.'
    ],
    grammarTipBn: 'Past hypothetical / regret: "would have been + adjective/noun"।',
    explanationBn: '"Rigid" মানে অনমনীয় বা একগুঁয়ে। "Flexibility" মানে নমনীয়তা।',
    commonMistakeBn: '"no hard on price" অপভাষা।'
  },
  {
    id: 'shp-45',
    category: 'shopping',
    level: 'intermediate',
    bn: 'এই ব্র্যান্ডের ঘড়িগুলো তাদের স্থায়িত্বের জন্য বিশ্বজুড়ে সুপরিচিত।',
    enPrimary: 'Watches of this brand are renowned worldwide for their durability.',
    enAlternatives: [
      'This brand\'s timepieces are celebrated globally for their longevity.',
      'These watches are famous across the globe for their lasting durability.',
      'Watches from this manufacturer are well-known for their rugged endurance.'
    ],
    grammarTipBn: '"Renowned for" (বিখ্যাত বা সুপরিচিত হওয়া)। এর সাথে preposition "for" বসে।',
    explanationBn: '"Durability" মানে স্থায়িত্ব বা টেকসই গুণ। ঘড়িকে মার্জিত ভাষায় "timepiece"ও বলা যায়।',
    commonMistakeBn: '"famous with" ভুল; renowned বা famous-এর পর "for" বসবে।'
  },
  {
    id: 'shp-46',
    category: 'shopping',
    level: 'advanced',
    bn: 'ভোক্তাদের সুরক্ষায় কৃত্রিম মূল্যবৃদ্ধি নিয়ন্ত্রণ করা সরকারের জন্য একটি অগ্রাধিকার।',
    enPrimary: 'Curbing artificial price hikes to safeguard consumers is a top priority for the government.',
    enAlternatives: [
      'Controlling artificial inflation in essential goods remains a paramount governmental duty.',
      'Preventing market syndicates from driving up commodity prices is imperative for consumer welfare.',
      'Reining in unjustified price inflation is essential to protect ordinary buyers.'
    ],
    grammarTipBn: '"Rein in" বা "curb" অর্থ লাগাম টেনে ধরা বা নিয়ন্ত্রণ করা। "Price hike" মানে মূল্যবৃদ্ধি।',
    explanationBn: '"Artificial price hike" হলো বাজারে সিন্ডিকেট বা অসাধু উপায়ে কৃত্রিমভাবে দাম বাড়ানো।',
    commonMistakeBn: '"fake price up" নয়, প্রমিত শব্দ হলো "artificial price hike"।'
  },
  {
    id: 'shp-47',
    category: 'shopping',
    level: 'advanced',
    bn: 'সচেতন ভোক্তা কখনোই প্রলোভনমূলক বিজ্ঞাপনে অন্ধভাবে বিশ্বাস স্থাপন করেন না।',
    enPrimary: 'A discerning consumer never places blind faith in tantalizing advertisements.',
    enAlternatives: [
      'Conscientious shoppers do not uncritically buy into deceptive marketing gimmicks.',
      'An astute consumer scrutinizes marketing claims rather than trusting seductive ads blindly.',
      'Prudent buyers remain skeptical of hyperbolic promotional campaigns.'
    ],
    grammarTipBn: '"Discerning" অর্থ সুবিবেচক, বিচক্ষণ যিনি ভালো-মন্দের তফাত করতে পারেন।',
    explanationBn: '"Tantalizing" অর্থ চিত্তাকর্ষক বা প্রলোভনময়। "Place faith in" মানে বিশ্বাস রাখা।',
    commonMistakeBn: '"good buyer no trust ad" ভাঙা ইংরেজি।'
  },
  {
    id: 'shp-48',
    category: 'shopping',
    level: 'beginner',
    bn: 'এই জামার কাপড়টি অত্যন্ত নরম ও আরামদায়ক।',
    enPrimary: 'The fabric of this dress is very soft and comfortable.',
    enAlternatives: [
      'This dress material feels extremely soft and comfy.',
      'The texture of this clothing is soft and pleasant to wear.',
      'This cloth is exceptionally soft and comfortable.'
    ],
    grammarTipBn: '"Comfortable" এর প্রমিত উচ্চারণ: কম্ফ-টা-ব্-ল (কমফোর্টেবল নয়)।',
    explanationBn: 'গুণবাচক বর্ণনায় Simple Present linking verb "is" বসেছে।',
    commonMistakeBn: '"soft and comfort" ভুল; দুটিই Adjective হতে হবে (soft and comfortable)।'
  },
  {
    id: 'shp-49',
    category: 'shopping',
    level: 'beginner',
    bn: 'দোকানটি রাত ১০টায় বন্ধ হয়ে যায়।',
    enPrimary: 'The shop closes at 10 PM.',
    enAlternatives: [
      'The store shuts down at 10 PM.',
      'The store closes at 10 o\'clock at night.',
      'The shop is open until 10 PM.'
    ],
    grammarTipBn: 'নির্ধারিত সময়সূচি প্রকাশের জন্য Present Simple: "closes at 10 PM"।',
    explanationBn: 'দোকান বন্ধ হওয়ার ক্ষেত্রে "closes" বা "shuts" ব্যবহৃত হয়।',
    commonMistakeBn: '"Shop is closing 10 PM" (রুটিন বা সময়সূচিতে present simple হয়)।'
  },
  {
    id: 'shp-50',
    category: 'shopping',
    level: 'intermediate',
    bn: 'আমি পণ্যটি পছন্দ করেছি কিন্তু এটি আমার বাজেটের বাইরে।',
    enPrimary: 'I like the item, but it is beyond my budget.',
    enAlternatives: [
      'I adore the product, but it exceeds my budget.',
      'I like it, but it is way out of my price range.',
      'It appeals to me, but sadly it is over my budget.'
    ],
    grammarTipBn: '"Beyond my budget" বা "out of my price range" সাধ্যের অতীত বা খরচের অতিরিক্ত বোঝানোর সুন্দর এক্সপ্রেশন।',
    explanationBn: '"Exceeds my budget" প্রাতিষ্ঠানিক ও আকর্ষণীয়।',
    commonMistakeBn: '"out of my pocket" এর চেয়ে "beyond my budget" সঠিক রূপ।'
  },
  {
    id: 'shp-51',
    category: 'shopping',
    level: 'advanced',
    bn: 'পরিবেশবান্ধব ও পুনর্ব্যবহারযোগ্য ব্যাগের ব্যবহার প্লাস্টিক দূষণ হ্রাসে কার্যকর অবদান রাখে।',
    enPrimary: 'The adoption of eco-friendly and reusable bags contributes significantly to curbing plastic pollution.',
    enAlternatives: [
      'Utilizing biodegradable shopping bags plays a decisive role in mitigating plastic waste.',
      'Switching to reusable tote bags significantly alleviates environmental plastic contamination.',
      'Embracing sustainable shopping bags makes a meaningful contribution to reducing plastic pollution.'
    ],
    grammarTipBn: '"Contribute to + gerund" (contributes to curbing, not to curb)।',
    explanationBn: '"Mitigate" বা "alleviate" মানে কোনো ক্ষতিকর প্রভাব হ্রাস করা।',
    commonMistakeBn: '"contribute to curb" ভুল; contribute to-এর পর verb-এর সাথে -ing বসবে।'
  }
];
