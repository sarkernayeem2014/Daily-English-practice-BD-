import { SentenceItem } from '../../types';

export const DAILY_ROUTINE_SENTENCES: SentenceItem[] = [
  {
    id: 'dr-01',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি প্রতিদিন সকাল ৬টায় ঘুম থেকে উঠি।',
    enPrimary: 'I wake up at 6 AM every day.',
    enAlternatives: [
      'I get up at 6 AM every day.',
      'Every day I wake up at 6 AM.',
      'Every day I get up at 6 AM.',
      'I wake up at six in the morning every day.',
      'I get up at six in the morning every day.'
    ],
    grammarTipBn: 'নিয়মিত অভ্যাস বা অভ্যস্ত কাজের জন্য Simple Present Tense ব্যবহৃত হয় (Subject + Verb-এর base form)।',
    explanationBn: 'wake up অর্থ ঘুম ভাঙা আর get up অর্থ বিছানা ছেড়ে ওঠা। দৈনন্দিন ব্যবহারে দুটিই সঠিক। নির্দিষ্ট সময়ের পূর্বে preposition "at" বসে।',
    commonMistakeBn: 'অনেকে "I am waking up at 6 AM" বলেন, যা ভুল। রুটিনের ক্ষেত্রে continuous tense হয় না।'
  },
  {
    id: 'dr-02',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি খাওয়ার আগে হাত ধুয়ে নিই।',
    enPrimary: 'I wash my hands before eating.',
    enAlternatives: [
      'I wash my hands before having food.',
      'I wash my hands before my meal.',
      'Before eating, I wash my hands.',
      'I wash my hands before meals.'
    ],
    grammarTipBn: 'Preposition (before/after)-এর পর কোনো verb আসলে তার সাথে -ing যুক্ত হয় (Gerund রূপ)।',
    explanationBn: '"before eating" হলো প্রাকৃতিক প্রকাশ। "I wash hands" না বলে "I wash my hands" বলা বেশি সঠিক।',
    commonMistakeBn: '"Before to eat" বা "Before eat" বলা ব্যাকরণগত ভুল।'
  },
  {
    id: 'dr-03',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'সে নিয়মিত দাঁত ব্রাশ করে।',
    enPrimary: 'He brushes his teeth regularly.',
    enAlternatives: [
      'He brushes his teeth every day.',
      'She brushes her teeth regularly.',
      'He cleans his teeth regularly.'
    ],
    grammarTipBn: 'Subject 3rd person singular (He/She) হলে Present Simple Tense-এ verb-এর শেষে -s বা -es যোগ করতে হয়।',
    explanationBn: 'brush শেষে sh থাকায় -es যোগ হয়ে brushes হয়েছে। tooth এর বহুবচন teeth।',
    commonMistakeBn: '"He brush his teeth" বা "tooths" বলা ভুল।'
  },
  {
    id: 'dr-04',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি সকালে এক কাপ চা খাই।',
    enPrimary: 'I have a cup of tea in the morning.',
    enAlternatives: [
      'I drink a cup of tea in the morning.',
      'I take a cup of tea in the morning.',
      'In the morning, I have a cup of tea.',
      'In the morning, I drink a cup of tea.'
    ],
    grammarTipBn: 'চা বা কফি পানের ক্ষেত্রে "drink" এর চেয়ে "have" বা "take" অনেক বেশি স্বাভাবিক ও প্রমিত।',
    explanationBn: 'সকালের সময়ের পূর্বে preposition "in the morning" ব্যবহার করা হয়।',
    commonMistakeBn: 'চা পানে "eat tea" কখনো বলা যাবে না।'
  },
  {
    id: 'dr-05',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমার মা সকালের নাস্তা তৈরি করছেন।',
    enPrimary: 'My mother is preparing breakfast.',
    enAlternatives: [
      'My mom is making breakfast.',
      'My mother is cooking breakfast.',
      'My mother is making breakfast.'
    ],
    grammarTipBn: 'বর্তমানে কোনো কাজ চলছে বোঝাতে Present Continuous Tense ব্যবহৃত হয় (Subject + am/is/are + verb-ing)।',
    explanationBn: 'নাস্তা তৈরির জন্য "making breakfast" বা "preparing breakfast" সবচেয়ে মানানসই।',
    commonMistakeBn: 'Breakfast-এর পূর্বে সাধারণত "the" বসে না (unless specific)।'
  },
  {
    id: 'dr-06',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি এখন গোসল করতে যাচ্ছি।',
    enPrimary: 'I am going to take a bath now.',
    enAlternatives: [
      'I am going to have a shower now.',
      'I am going to take a shower now.',
      "I'm going to take a bath now.",
      "I'm going to have a bath now.",
      'I am taking a bath now.'
    ],
    grammarTipBn: 'নিকট ভবিষ্যতের তাৎক্ষণিক সিদ্ধান্তের ক্ষেত্রে "be going to + verb" সুন্দর প্রকাশভঙ্গি।',
    explanationBn: 'গোসল করার ইংরেজি "take a bath" বা "take a shower" বা "have a shower"।',
    commonMistakeBn: '"I am going to bathe" এর চেয়ে "take a shower/bath" কথ্য ভাষায় বেশি প্রচলিত।'
  },
  {
    id: 'dr-07',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমার বাবা সকালের খবরের কাগজ পড়ছেন।',
    enPrimary: 'My father is reading the morning newspaper.',
    enAlternatives: [
      'My dad is reading the morning paper.',
      'My father is reading the newspaper in the morning.',
      'My dad is reading the newspaper.'
    ],
    grammarTipBn: 'নির্দিষ্ট সংবাদপত্র বা দিনের খবরের কাগজের আগে "the" বসে।',
    explanationBn: 'Present Continuous-এ "is reading" ব্যবহৃত হয়েছে কারণ Father হলো 3rd person singular।',
    commonMistakeBn: '"My father reading newspaper" (auxiliary verb "is" বাদ দেয়া যাবে না)।'
  },
  {
    id: 'dr-08',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'দেরি হয়ে যাচ্ছে, আমার জামাকাপড় পরা উচিত।',
    enPrimary: "It is getting late, I should get dressed.",
    enAlternatives: [
      "It's getting late, I should get dressed.",
      "It is getting late, I need to get dressed.",
      "It's getting late, I must get dressed.",
      "It is getting late, I ought to get dressed."
    ],
    grammarTipBn: 'কোনো অবস্থা পরিবর্তনশীল বোঝাতে "get + adjective" যেমন: "getting late"। জামা পরার idiom হলো "get dressed"।',
    explanationBn: 'উচিত অর্থে modal verb "should" বসে এবং এর পর verb-এর base form "get" বসে।',
    commonMistakeBn: '"I should wear dress" বলার চেয়ে "I should get dressed" অধিকতর প্রাকৃতিক।'
  },
  {
    id: 'dr-09',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি জুতা পরে বাইরে যাচ্ছি।',
    enPrimary: 'I put on my shoes and go outside.',
    enAlternatives: [
      'I am putting on my shoes and going outside.',
      "I'm putting on my shoes and going out.",
      'I put on my shoes and head outside.'
    ],
    grammarTipBn: 'পোশাক বা জুতো পরার phrasal verb হলো "put on"।',
    explanationBn: 'খোলার ক্ষেত্রে "take off" এবং পরার ক্ষেত্রে "put on" ব্যবহৃত হয়।',
    commonMistakeBn: '"Wear shoes" সাধারণত অবস্থার বিবরণ দেয়, আর পরার কাজটির জন্য "put on" উপযুক্ত।'
  },
  {
    id: 'dr-10',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি সাধারণত রাত ১১টায় ঘুমাতে যাই।',
    enPrimary: 'I usually go to bed at 11 PM.',
    enAlternatives: [
      'I usually sleep at 11 PM.',
      'Usually, I go to bed at 11 PM.',
      'I normally go to bed at 11 PM.',
      'I usually go to sleep at 11 PM.'
    ],
    grammarTipBn: 'Adverb of frequency (usually, always, often) সাধারণত মূল verb-এর ঠিক পূর্বে বসে।',
    explanationBn: '"Go to bed" মানে বিছানায় শুতে যাওয়া। রাত বোঝাতে "11 PM" বা "11 o\'clock at night" বসে।',
    commonMistakeBn: '"I go to bed at 11 PM usually" বলার চেয়ে adverb-টি verb-এর আগে রাখলে বাক্য সাবলীল হয়।'
  },
  {
    id: 'dr-11',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমার অ্যালার্ম আজ সকালে বাজেনি।',
    enPrimary: "My alarm did not go off this morning.",
    enAlternatives: [
      "My alarm didn't go off this morning.",
      "My alarm didn't ring this morning.",
      "My alarm did not ring this morning."
    ],
    grammarTipBn: 'ঘড়ি বা অ্যালার্ম বাজার স্বাভাবিক Phrasal Verb হলো "go off"। Past Simple negative-এ "did not + verb base form" হয়।',
    explanationBn: '"did not go off" ব্যবহৃত হয়েছে কারণ ঘটনাটি অতীতের (আজ সকালের)।',
    commonMistakeBn: '"My alarm did not played" বা "alarm didn\'t blow" বলা যাবে না।'
  },
  {
    id: 'dr-12',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'ঘুম ভাঙার পর আমি কিছুক্ষণ বিছানায় শুয়ে থাকি।',
    enPrimary: 'After waking up, I lie in bed for a while.',
    enAlternatives: [
      'I lie in bed for a while after waking up.',
      'After I wake up, I stay in bed for some time.',
      'After waking up, I stay in bed for a while.'
    ],
    grammarTipBn: 'নিজে শুয়ে থাকার ইংরেজি "lie" (lie in bed), অন্যকিছু রাখার ক্ষেত্রে "lay"।',
    explanationBn: '"for a while" মানে কিছুক্ষণের জন্য। Preposition "after" এর পরে verb-ing "waking up" বসেছে।',
    commonMistakeBn: '"I sleep in bed for a while" বললে অর্থ দাঁড়াবে আপনি আবার ঘুমিয়ে পড়েন।'
  },
  {
    id: 'dr-13',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি সকালে হালকা ব্যায়াম করতে পছন্দ করি।',
    enPrimary: 'I like doing light exercise in the morning.',
    enAlternatives: [
      'I like to do light exercise in the morning.',
      'I prefer doing light workouts in the morning.',
      'I like to work out lightly in the morning.'
    ],
    grammarTipBn: '"Like" verb এর পর gerund (-ing) বা infinitive (to + verb) দুটিই ব্যাকরণসিদ্ধ।',
    explanationBn: '"light exercise" অর্থ হালকা শরীরচর্চা। ব্যায়াম করার সাথে verb "do" বা "take" বসে।',
    commonMistakeBn: '"I like light exercise morning" (Preposition "in the morning" বাদ দেওয়া যাবে না)।'
  },
  {
    id: 'dr-14',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'অফিসে যাওয়ার আগে আমাকে সব গুছিয়ে নিতে হবে।',
    enPrimary: 'I have to pack everything before heading to the office.',
    enAlternatives: [
      'I have to organize everything before going to the office.',
      'I need to pack everything before leaving for work.',
      'Before going to the office, I have to get everything ready.'
    ],
    grammarTipBn: 'কোনো কাজ করার বাধ্যবাধকতা প্রকাশে "have to + verb" ব্যবহৃত হয়।',
    explanationBn: '"head to" একটি চমৎকার কথ্য প্রকাশ যার অর্থ কোনো স্থানের দিকে রওনা হওয়া।',
    commonMistakeBn: '"I must to pack" ভুল; modal verb "must" এর পর "to" বসে না, কিন্তু "have to" এর সাথে "to" থাকে।'
  },
  {
    id: 'dr-15',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি কাজের ফাঁকে কিছু পানি পান করে নিই।',
    enPrimary: 'I drink some water between tasks.',
    enAlternatives: [
      'I drink some water in between work.',
      'I have some water during breaks.',
      'I take some water between my tasks.'
    ],
    grammarTipBn: 'দুই বা ততোধিক কাজের মাঝে বোঝাতে preposition "between" ব্যবহৃত হয়।',
    explanationBn: 'পানি অপরিমাপযোগ্য (uncountable noun), তাই এর পূর্বে "some water" বসে।',
    commonMistakeBn: '"a water" বলা ভুল।'
  },
  {
    id: 'dr-16',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'সে প্রতিদিন কাজের উদ্দেশ্যে সকাল ৮টায় বাসা থেকে বের হয়।',
    enPrimary: 'He leaves home for work at 8 AM every day.',
    enAlternatives: [
      'She leaves home for work at 8 AM every day.',
      'Every day he leaves home for work at 8 AM.',
      'He leaves the house for work at 8:00 AM daily.'
    ],
    grammarTipBn: 'কোনো গন্তব্যে রওনা হওয়ার ক্ষেত্রে "leave for (destination)" ব্যবহৃত হয়।',
    explanationBn: '"Leave home for work" অর্থ কাজের উদ্দেশে বাড়ি ত্যাগ করা। নির্দিষ্ট সময়ের আগে "at" বসে।',
    commonMistakeBn: '"He leaves from home to work" এর চেয়ে "leaves home for work" অনেক মার্জিত।'
  },
  {
    id: 'dr-17',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'দুপুরের খাবারের পর আমার একটু তন্দ্রাভাব আসে।',
    enPrimary: 'I feel drowsy after lunch.',
    enAlternatives: [
      'I feel sleepy after lunch.',
      'I get drowsy after lunch.',
      'After lunch, I feel sleepy.',
      'I feel a bit drowsy after having lunch.'
    ],
    grammarTipBn: 'শারীরিক অনুভূতি প্রকাশের জন্য "feel + adjective" (feel drowsy/sleepy) ব্যবহৃত হয়।',
    explanationBn: '"drowsy" অর্থ অলস বা ঘুম ঘুম ভাব। "after lunch" এর মাধ্যমে সময় নির্দেশ করা হয়েছে।',
    commonMistakeBn: '"Sleeping is coming to me" বাংলায় প্রচলিত অনুবাদ হলেও ইংরেজিতে সম্পূর্ণ ভুল।'
  },
  {
    id: 'dr-18',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'সন্ধ্যায় বাড়ি ফিরে আমি কিছুক্ষণ বিশ্রাম নিই।',
    enPrimary: 'When I get back home in the evening, I take a rest for a while.',
    enAlternatives: [
      'After returning home in the evening, I rest for a while.',
      'I take a short rest after returning home in the evening.',
      'When I return home in the evening, I take a rest for a while.'
    ],
    grammarTipBn: '"Home" শব্দের পূর্বে "to" বসে না (e.g. get back home, go home)।',
    explanationBn: '"take a rest" বা শুধু "rest" বিশ্রাম নেয়া বোঝায়।',
    commonMistakeBn: '"return to home" লেখা ভুল, শুধু "return home" হবে।'
  },
  {
    id: 'dr-19',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'রাতের খাবারের পর আমরা সবাই মিলে একটু গল্প করি।',
    enPrimary: 'After dinner, we all chat for a bit.',
    enAlternatives: [
      'We all chat for a while after dinner.',
      'After dinner, we all talk for a little while.',
      'We have a chat together after dinner.'
    ],
    grammarTipBn: '"for a bit" বা "for a while" সময়সীমার পরিমাপ নির্দেশ করে।',
    explanationBn: 'অনানুষ্ঠানিক বন্ধুভাবাপন্ন কথাবার্তার জন্য "chat" শব্দটি অত্যন্ত মানানসই।',
    commonMistakeBn: '"We gossiping together" (auxiliary verb নেই এবং gossip সাধারণত পরনিন্দা অর্থে ব্যবহৃত হয়)।'
  },
  {
    id: 'dr-20',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'ঘুমানোর আগে আমি আমার ফোন সাইলেন্ট করে রাখি।',
    enPrimary: 'I put my phone on silent before going to sleep.',
    enAlternatives: [
      'I set my phone to silent before sleeping.',
      'Before going to bed, I put my phone on silent.',
      'I silence my phone before going to bed.'
    ],
    grammarTipBn: 'ফোন সাইলেন্ট করার সঠিক এক্সপ্রেশন হলো "put/set phone on silent"।',
    explanationBn: '"before going to sleep" এ before preposition থাকায় verb-ing হয়েছে।',
    commonMistakeBn: '"I make my phone silent" এর চেয়ে "put my phone on silent" অনেক বেশি স্বাভাবিক।'
  },
  {
    id: 'dr-21',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'ব্যস্ত দিনের ধকল সামলাতে আমি নিয়মিত মেডিটেশন করি।',
    enPrimary: 'I practice meditation regularly to cope with the stress of a hectic day.',
    enAlternatives: [
      'I meditate regularly to cope with the stress of a hectic day.',
      'To manage the stress of a busy day, I meditate regularly.',
      'I meditate on a regular basis to deal with daily stress.'
    ],
    grammarTipBn: 'কোনো কঠিন পরিস্থিতি সামলানোর জন্য phrasal verb "cope with" ব্যবহৃত হয় (cope up with নয়)।',
    explanationBn: '"hectic day" মানে অত্যন্ত ব্যস্ত ও দৌড়ঝাঁপপূর্ণ দিন। উদ্দেশ্য বোঝাতে infinitive "to cope with" বসেছে।',
    commonMistakeBn: 'বাংলাদেশী শিক্ষার্থীদের বহুল ভুল হলো "cope up with" বলা। সঠিক হলো শুধু "cope with"।'
  },
  {
    id: 'dr-22',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'আমি প্রতিদিনের কাজের অগ্রাধিকার ঠিক করে একটি তালিকা তৈরি করি।',
    enPrimary: 'I make a to-do list prioritizing my daily tasks.',
    enAlternatives: [
      'I create a to-do list by prioritizing my daily activities.',
      'I prioritize my daily tasks by making a to-do list.',
      'I prepare a prioritized daily to-do list.'
    ],
    grammarTipBn: 'Participle clause ("prioritizing my daily tasks") মূল কাজের ধরন বা পদ্ধতি ব্যাখ্যা করে।',
    explanationBn: '"Prioritize" মানে গুরুত্ব অনুযায়ী অগ্রাধিকার নির্ধারণ করা।',
    commonMistakeBn: '"I make serial of my works" - অসংগত শব্দচয়ন।'
  },
  {
    id: 'dr-23',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'পড়াশোনায় মনোযোগ বজায় রাখতে আমি কাজের মাঝে মাঝে ছোট বিরতি নিই।',
    enPrimary: 'I take short breaks intermittently to maintain focus on my studies.',
    enAlternatives: [
      'I take intermittent breaks to stay focused on my studies.',
      'To maintain concentration, I take frequent short breaks while studying.',
      'I take brief breaks in between to keep my focus intact.'
    ],
    grammarTipBn: '"Intermittently" হলো একটি চমৎকার adverb যার অর্থ মাঝে মাঝে বা বিরতি দিয়ে দিয়ে।',
    explanationBn: 'মনোযোগ ধরে রাখার জন্য "maintain focus" বা "stay focused" ব্যবহার করা হয়।',
    commonMistakeBn: '"Break break" না বলে "short breaks intermittently" বলা প্রমিত ইংরেজি।'
  },
  {
    id: 'dr-24',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'রাত জাগার কুফল জানা সত্ত্বেও আমি প্রায়ই দেরিতে ঘুমাই।',
    enPrimary: 'Despite knowing the downsides of staying up late, I often go to bed late.',
    enAlternatives: [
      'Although I know the ill effects of staying up late, I often sleep late.',
      'In spite of being aware of the negative consequences of staying up late, I often sleep late.',
      'Despite knowing the negative impacts of night owl habits, I often go to bed late.'
    ],
    grammarTipBn: '"Despite" এর পরে noun phrase বা gerund বসে, কিন্তু কোনো "of" বসে না ("In spite of" এর ক্ষেত্রে of বসে)।',
    explanationBn: '"Stay up late" মানে গভীর রাত পর্যন্ত জেগে থাকা। "Downsides" মানে নেতিবাচক দিক।',
    commonMistakeBn: '"Despite of" লেখা মস্ত বড় ব্যাকরণ ভুল।'
  },
  {
    id: 'dr-25',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'সুস্থ থাকার জন্য দিনে অন্তত দুই লিটার পানি পান করা আবশ্যক।',
    enPrimary: 'It is essential to drink at least two liters of water daily to stay healthy.',
    enAlternatives: [
      'Drinking at least two liters of water a day is essential for staying healthy.',
      'To stay healthy, it is imperative to consume at least two liters of water every day.',
      'It is crucial to drink at least two liters of water each day to remain healthy.'
    ],
    grammarTipBn: '"It is + adjective (essential/crucial) + to-infinitive" একটি প্রমিত ইংরেজি গঠন।',
    explanationBn: '"Essential" মানে অত্যাবশ্যকীয়। পরিমাণ নির্দেশ করতে "at least" (কমপক্ষে) বসেছে।',
    commonMistakeBn: '"Drink water is must" ব্যাকরণগতভাবে অশুদ্ধ।'
  },
  {
    id: 'dr-26',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি সকালে চা খাওয়ার আগে এক গ্লাস হালকা গরম পানি পান করি।',
    enPrimary: 'I drink a glass of lukewarm water before having morning tea.',
    enAlternatives: [
      'I drink a glass of warm water before having morning tea.',
      'Before having my morning tea, I drink a glass of lukewarm water.',
      'I take a glass of warm water before morning tea.'
    ],
    grammarTipBn: '"Lukewarm" অর্থ ঈষদুষ্ণ বা কুসুম গরম।',
    explanationBn: 'সকালে গরম পানি খাওয়ার জন্য "lukewarm water" বা "warm water" সবচেয়ে প্রচলিত।',
    commonMistakeBn: '"half hot water" বলা যাবে না।'
  },
  {
    id: 'dr-27',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমার ভাই এখনও বিছানা ছাড়েনি।',
    enPrimary: 'My brother has not gotten out of bed yet.',
    enAlternatives: [
      "My brother hasn't gotten out of bed yet.",
      'My brother is still in bed.',
      "My brother hasn't woken up yet."
    ],
    grammarTipBn: 'Negative বাক্যে "yet" সাধারণত বাক্যের শেষে বসে এবং Present Perfect Tense ব্যবহার হয়।',
    explanationBn: '"get out of bed" অর্থ বিছানা ত্যাগ করা। Still in bed ও সঠিক বিকল্প।',
    commonMistakeBn: '"My brother till now sleeping" বলা ভুল।'
  },
  {
    id: 'dr-28',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি আয়নায় নিজের চুল আঁচড়াচ্ছি।',
    enPrimary: 'I am combing my hair in the mirror.',
    enAlternatives: [
      "I'm combing my hair in the mirror.",
      'I am brushing my hair in front of the mirror.',
      "I'm doing my hair in front of the mirror."
    ],
    grammarTipBn: 'আয়নায় তাকানো বা দেখা বোঝাতে "in the mirror" বা "in front of the mirror" বসে।',
    explanationBn: 'চিরুনি দিয়ে আঁচড়ানো "comb" (এখানে b অনুচ্চারিত: কোম)। ব্রাশ দিয়ে হলে "brush"।',
    commonMistakeBn: '"combing hair with mirror" প্রিপজিশন ভুল।'
  },
  {
    id: 'dr-29',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি রুম থেকে বের হওয়ার সময় বাতি বন্ধ করি।',
    enPrimary: 'I turn off the lights when leaving the room.',
    enAlternatives: [
      'I switch off the light when I leave the room.',
      'I turn off the light before leaving the room.',
      'When leaving the room, I turn off the lights.'
    ],
    grammarTipBn: 'বৈদ্যুতিক যন্ত্র বন্ধ করার phrasal verb হলো "turn off" বা "switch off"।',
    explanationBn: '"When leaving" এখানে participle clause হিসেবে ব্যবহৃত হয়েছে।',
    commonMistakeBn: 'বাতি নেভানোর ক্ষেত্রে "close the light" বলা খুবই সাধারণ কিন্তু বড় ভুল।'
  },
  {
    id: 'dr-30',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি আমার জুতো পরিষ্কার করছি।',
    enPrimary: 'I am cleaning my shoes.',
    enAlternatives: [
      "I'm cleaning my shoes.",
      'I am polishing my shoes.',
      "I'm shining my shoes."
    ],
    grammarTipBn: 'Present continuous: Subject + am/is/are + verb-ing.',
    explanationBn: 'কালি দিয়ে পালিশ করার ক্ষেত্রে "polishing my shoes" ব্যবহার করা যায়।',
    commonMistakeBn: 'Shoes সর্বদা বহুবচন (plural), তাই "my shoes" হবে।'
  },
  {
    id: 'dr-31',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'সে প্রতিদিন সকালে হাঁটতে যায়।',
    enPrimary: 'He goes for a walk every morning.',
    enAlternatives: [
      'She goes for a walk every morning.',
      'He goes on a morning walk every day.',
      'Every morning he goes for a walk.'
    ],
    grammarTipBn: 'হাঁটতে যাওয়ার স্বাভাবিক idiom হলো "go for a walk"।',
    explanationBn: 'Subject He হওয়ার কারণে "goes" হয়েছে (Present Simple)।',
    commonMistakeBn: '"He goes to walking" বলা ব্যাকরণগতভাবে ভুল।'
  },
  {
    id: 'dr-32',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি প্রতিদিন কমপক্ষে আধা ঘণ্টা বই পড়ার চেষ্টা করি।',
    enPrimary: 'I try to read books for at least half an hour every day.',
    enAlternatives: [
      'I try to read for at least thirty minutes daily.',
      'Every day I try to spend at least half an hour reading books.',
      'I endeavor to read for at least half an hour daily.'
    ],
    grammarTipBn: 'সময়ের পরিমাপ নির্দেশ করতে "half an hour" বা "thirty minutes" এর আগে "for" বসে।',
    explanationBn: '"Try to + verb" দিয়ে কোনো কিছু করার চেষ্টার অভ্যাস নির্দেশ করা হয়েছে।',
    commonMistakeBn: '"half hour" এর পূর্বে article "an" বাদ দেওয়া যায় না, বলতে হবে "half an hour"।'
  },
  {
    id: 'dr-33',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'অফিস থেকে ফেরার পথে আমি বাজার করে নিয়ে আসি।',
    enPrimary: 'I pick up groceries on my way back from the office.',
    enAlternatives: [
      'On my way home from work, I buy groceries.',
      'I do the groceries on my way back from work.',
      'I buy groceries on the way back from office.'
    ],
    grammarTipBn: 'কোনো স্থান থেকে ফেরার পথ বোঝাতে "on my way back from..." ব্যবহৃত হয়।',
    explanationBn: '"pick up groceries" মানে ফেরার পথে দ্রুত বাজার কিনে সাথে নিয়ে নেওয়া।',
    commonMistakeBn: '"in the return road" বলা যাবে না, বলতে হবে "on my way back"।'
  },
  {
    id: 'dr-34',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি সপ্তাহে দুদিন আমার কাপড় ধুয়ে পরিষ্কার করি।',
    enPrimary: 'I do my laundry twice a week.',
    enAlternatives: [
      'I wash my clothes twice a week.',
      'Twice a week, I do my laundry.',
      'I wash my clothes two days a week.'
    ],
    grammarTipBn: '"Twice a week" মানে সপ্তাহে দুইবার (two times a week এর চেয়ে twice a week প্রমিত)।',
    explanationBn: 'কাপড় কাচার স্বাভাবিক ইংরেজি হলো "do the laundry" বা "wash clothes"।',
    commonMistakeBn: '"I clean my cloths" - "cloths" মানে টুকরো কাপড়, পরিধেয় পোশাক হলো "clothes" বা "laundry"।'
  },
  {
    id: 'dr-35',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'ক্লান্ত লাগলে আমি এক কাপ কড়া কফি বানিয়ে খাই।',
    enPrimary: 'When I feel tired, I brew a strong cup of coffee.',
    enAlternatives: [
      'When I feel tired, I make a cup of strong coffee.',
      'I make a cup of strong coffee whenever I feel exhausted.',
      'If I feel tired, I have a cup of strong coffee.'
    ],
    grammarTipBn: 'Conditional / time clause: "When + present simple, present simple" (General truth / Habit).',
    explanationBn: 'কড়া কফির ইংরেজি "strong coffee"। কফি বানানোর আকর্ষণীয় verb হলো "brew" বা "make"।',
    commonMistakeBn: '"hard coffee" বলা ভুল, সঠিক বিশেষণ হলো "strong coffee"।'
  },
  {
    id: 'dr-36',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি রাতে ঘুমাতে যাওয়ার আগে ডায়েরি লিখি।',
    enPrimary: 'I write in my diary before going to bed.',
    enAlternatives: [
      'I keep a journal before going to sleep.',
      'Before going to bed, I write my diary.',
      'I write my diary every night before sleeping.'
    ],
    grammarTipBn: 'নিয়মিত ডায়েরি লেখার জন্য "keep a journal" বা "write in a diary" প্রচলিত।',
    explanationBn: 'Going to bed একটি প্রাকৃতিক অভিব্যক্তি যার অর্থ ঘুমাতে যাওয়া।',
    commonMistakeBn: '"write diary" এর চেয়ে "write in my diary" বা "keep a diary" শুদ্ধতর।'
  },
  {
    id: 'dr-37',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'সকালে আমার এক কাপ চা ছাড়া দিনটিই শুরু হয় না।',
    enPrimary: "My day doesn't really start without a morning cup of tea.",
    enAlternatives: [
      'My day does not start without a cup of morning tea.',
      'I cannot start my day without a cup of tea in the morning.',
      "I can't begin my day without having a cup of tea."
    ],
    grammarTipBn: '"Without" এর পর noun phrase বসেছে (without a morning cup of tea)।',
    explanationBn: 'কথ্য ভাষায় মনের ভাব ফুটিয়ে তুলতে "doesn\'t really start without..." সুন্দর বাক্য।',
    commonMistakeBn: '"Without eating tea my day no start" আক্ষরিক অনুবাদের হাস্যকর ভুল।'
  },
  {
    id: 'dr-38',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'সকালে অলসতা কাটিয়ে উঠতে আমি এক গ্লাস ঠান্ডা পানি দিয়ে মুখ ধুয়ে নিই।',
    enPrimary: 'To shake off morning sluggishness, I splash cold water on my face.',
    enAlternatives: [
      'I splash cold water on my face to overcome morning drowsiness.',
      'To shake off my morning lethargy, I wash my face with cold water.',
      'Splashing cold water on my face helps me overcome morning laziness.'
    ],
    grammarTipBn: 'কোনো জড়তা বা অলসতা ঝেড়ে ফেলার idiom হলো "shake off"। মুখে পানি ছিটানোর ইংরেজি "splash water on face"।',
    explanationBn: '"Sluggishness" বা "lethargy" জড়তা ও অলসতার উন্নত প্রতিশব্দ।',
    commonMistakeBn: '"throw water on face" বললে আক্রমণাত্মক শোনায়, সঠিক হলো "splash cold water"।'
  },
  {
    id: 'dr-39',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'কাজের ফাঁকে ফাঁকে স্ক্রিন থেকে চোখ সরিয়ে নেওয়া চোখের জন্য ভালো।',
    enPrimary: 'Taking your eyes off the screen intermittently is beneficial for your eyesight.',
    enAlternatives: [
      'Looking away from the screen periodically does wonders for eye health.',
      'It is advisable to rest your eyes by looking away from the screen from time to time.',
      'Taking regular screen breaks is good for your eyes.'
    ],
    grammarTipBn: 'Gerund phrase ("Taking your eyes off...") এখানে বাক্যের Subject হিসেবে বসেছে।',
    explanationBn: '"Beneficial" অর্থ উপকারী বা ভালো। "Eye health" বা "eyesight" অর্থ চোখের দৃষ্টি।',
    commonMistakeBn: '"Eye rest is good" অতি সরলীকরণ; পেশাদার ইংরেজি গঠন শিখুন।'
  },
  {
    id: 'dr-40',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'একটি সুষম রুটিন দৈনন্দিন জীবনের মানসিক চাপ অনেকাংশে লাঘব করে।',
    enPrimary: 'A well-balanced routine significantly alleviates everyday stress.',
    enAlternatives: [
      'Maintaining a structured routine substantially reduces daily anxiety and stress.',
      'A balanced daily routine goes a long way toward easing stress.',
      'A well-planned daily routine helps greatly in reducing stress.'
    ],
    grammarTipBn: '"Alleviate" মানে কোনো কষ্ট বা চাপ লাঘব বা উপশম করা (উন্নত শব্দভাণ্ডার)।',
    explanationBn: '"Well-balanced routine" হলো সুষম দিনলিপি। "Significantly" অর্থ উল্লেখযোগ্যভাবে।',
    commonMistakeBn: '"Routine makes stress low" এর জায়গায় "alleviates stress" ব্যবহার করুন।'
  },
  {
    id: 'dr-41',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি সকালে নাস্তা খাওয়ার পর ওষুধ খাই।',
    enPrimary: 'I take my medicine after having breakfast.',
    enAlternatives: [
      'I take medicine after breakfast.',
      'After breakfast, I take my medicine.',
      'I take my pill after having breakfast.'
    ],
    grammarTipBn: 'ওষুধ সেবন করার ক্ষেত্রে "take medicine" বসে, "eat medicine" নয়।',
    explanationBn: 'ঔষধ খাওয়ার স্বাভাবিক ইংরেজি "take medicine"।',
    commonMistakeBn: '"I eat medicine" বলা বাংলায় প্রচলিত কিন্তু ইংরেজিতে মারাত্মক ভুল।'
  },
  {
    id: 'dr-42',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'সে তার টেবিল গুছিয়ে রাখছে।',
    enPrimary: 'He is tidying up his desk.',
    enAlternatives: [
      'She is tidying up her desk.',
      'He is organizing his table.',
      'He is cleaning up his desk.'
    ],
    grammarTipBn: 'রুম বা টেবিল গোছানোর জন্য phrasal verb "tidy up" অত্যন্ত প্রচলিত।',
    explanationBn: 'পড়ার বা কাজের টেবিলকে সাধারণত "desk" বলা হয়।',
    commonMistakeBn: '"Tidy" এর সাথে up যুক্ত হয়ে পূর্ণাঙ্গ অর্থ দেয়।'
  },
  {
    id: 'dr-43',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি জুতো খুলে ঘরে ঢুকলাম।',
    enPrimary: 'I took off my shoes and entered the room.',
    enAlternatives: [
      'I took my shoes off and came into the room.',
      'Taking off my shoes, I entered the room.',
      'I took off my shoes and walked into the room.'
    ],
    grammarTipBn: 'পোশাক বা জুতো খোলার phrasal verb হলো "take off" (অতীত রূপ "took off")।',
    explanationBn: '"Enter" verb এর পর সরাসরি স্থান বসে, কোনো "into" বসে না (e.g. entered the room)।',
    commonMistakeBn: '"Entered into the room" বলা যাবে না, enter-এর সাথে preposition into বসে না।'
  },
  {
    id: 'dr-44',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি রাতে ঘুমানোর আগে দরজা বন্ধ করি।',
    enPrimary: 'I lock the door before going to sleep at night.',
    enAlternatives: [
      'I lock the door before going to bed.',
      'Before sleeping, I lock the front door.',
      'I make sure to lock the door before sleeping.'
    ],
    grammarTipBn: 'নিরাপত্তার জন্য দরজা ছিটকিনি বা তালা লাগানোকে "lock the door" বলা হয়।',
    explanationBn: '"Lock" মানে তালা দেওয়া বা ভেতর থেকে আটকানো।',
    commonMistakeBn: '"Shut" কেবল ভেজানো বোঝায়, সুরক্ষার জন্য "lock" ব্যবহার করা উত্তম।'
  },
  {
    id: 'dr-45',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমার কাজ শেষ হতে হতে সন্ধ্যা হয়ে যায়।',
    enPrimary: 'By the time I wrap up my work, evening sets in.',
    enAlternatives: [
      'By the time I finish my work, it becomes evening.',
      'It turns into evening by the time I finish working.',
      'Evening arrives by the time I finish my tasks.'
    ],
    grammarTipBn: '"By the time + present clause, present clause" সময়সীমা বোঝাতে ব্যবহৃত হয়।',
    explanationBn: '"Wrap up" অর্থ কাজ সম্পন্ন বা গুটিয়ে আনা। সন্ধ্যা নামাকে "evening sets in" বলা হয়।',
    commonMistakeBn: '"My work finish then evening" বাক্যগঠনহীন কথা।'
  },
  {
    id: 'dr-46',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি সপ্তাহে অন্তত একদিন ঘরদোর ভালোমতো পরিষ্কার করি।',
    enPrimary: 'I deep clean the house at least once a week.',
    enAlternatives: [
      'I clean the house thoroughly at least once a week.',
      'At least once a week, I give my room a thorough cleaning.',
      'I clean the whole house once a week.'
    ],
    grammarTipBn: '"Deep clean" বা "clean thoroughly" অর্থ পুঙ্খানুপুঙ্খভাবে পরিষ্কার করা।',
    explanationBn: '"Once a week" মানে সপ্তাহে একবার।',
    commonMistakeBn: '"one time in week" এর চেয়ে "once a week" স্বাভাবিক।'
  },
  {
    id: 'dr-47',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'ঘুম থেকে উঠেই ফোনের নোটিফিকেশন চেক করা ঠিক নয়।',
    enPrimary: 'Checking phone notifications right after waking up is not a good idea.',
    enAlternatives: [
      'It is not advisable to check phone notifications immediately after waking up.',
      'One should not check phone notifications right after getting up.',
      'Checking your phone the moment you wake up is bad for health.'
    ],
    grammarTipBn: 'Gerund ("Checking phone notifications...") বাক্যের Subject।',
    explanationBn: '"Right after" মানে ঠিক পরপরই। "Not a good idea" একটি ভদ্র উপদেশমূলক রীতি।',
    commonMistakeBn: '"Wake up and look phone not good" অপভাষা।'
  },
  {
    id: 'dr-48',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'দৈনন্দিন কাজের একঘেয়েমি দূর করতে আমি সাপ্তাহিক ছুটিতে প্রকৃতির কাছে যাই।',
    enPrimary: 'To break the monotony of daily life, I spend my weekends in nature.',
    enAlternatives: [
      'I head out into nature over the weekend to escape daily monotony.',
      'To break away from routine boredom, I retreat to nature on weekends.',
      'Spending weekends close to nature helps me escape the daily grind.'
    ],
    grammarTipBn: '"Monotony" অর্থ একঘেয়েমি। "Break the monotony" একটি চমৎকার ইংরেজি idiom।',
    explanationBn: '"Daily grind" বা "monotony of daily life" রুটিনের ক্লান্তি বোঝাতে দারুণ প্রকাশ।',
    commonMistakeBn: '"To finish boring daily work" না লিখে "break the monotony" লিখলে প্রকাশ উন্নত হয়।'
  },
  {
    id: 'dr-49',
    category: 'daily-routine',
    level: 'advanced',
    bn: 'সময়মতো কাজ শেষ করতে পারলে মানসিক প্রশান্তি পাওয়া যায়।',
    enPrimary: 'Finishing tasks on schedule brings immense peace of mind.',
    enAlternatives: [
      'Completing work on time gives a great sense of peace.',
      'Being able to meet deadlines provides genuine peace of mind.',
      'Finishing tasks promptly ensures mental peace.'
    ],
    grammarTipBn: '"On schedule" বা "on time" মানে সময়মতো বা নির্ধারিত সময়ে।',
    explanationBn: '"Peace of mind" মানসিক শান্তি বোঝাতে সর্বাধিক ব্যবহৃত প্রমিত শব্দযুগল।',
    commonMistakeBn: '"Mind peace" বলা যাবে না, বলতে হবে "peace of mind"।'
  },
  {
    id: 'dr-50',
    category: 'daily-routine',
    level: 'beginner',
    bn: 'আমি প্রতিদিন আধ ঘণ্টা হেঁটে কাজে যাই।',
    enPrimary: 'I walk to work for half an hour every day.',
    enAlternatives: [
      'Every day I walk thirty minutes to work.',
      'I walk to my workplace for thirty minutes daily.',
      'It takes me half an hour to walk to work each day.'
    ],
    grammarTipBn: '"Walk to work" অর্থ হেঁটে কর্মস্থলে যাওয়া ("go to work on foot" এর চেয়ে বেশি প্রাকৃতিক)।',
    explanationBn: 'দৈনন্দিন অভ্যাস প্রকাশে Present Indefinite Tense ব্যবহৃত হয়।',
    commonMistakeBn: '"I go by walk" ভুল; বলতে হবে "I go on foot" অথবা সহজ কথায় "I walk to work"।'
  },
  {
    id: 'dr-51',
    category: 'daily-routine',
    level: 'intermediate',
    bn: 'আমি ঘুমানোর ঠিক এক ঘণ্টা আগে সব ধরনের ডিজিটাল পর্দা এড়িয়ে চলি।',
    enPrimary: 'I avoid all digital screens an hour before hitting the sack.',
    enAlternatives: [
      'I avoid digital screens an hour before bedtime.',
      'I stay away from screens an hour before going to sleep.',
      'One hour before bed, I turn off all digital devices.'
    ],
    grammarTipBn: '"Hit the sack" ঘুমাতে যাওয়ার একটি জনপ্রিয় ইংরেজি ইডিয়ম।',
    explanationBn: '"Avoid digital screens" মানে স্ক্রিনের ক্ষতিকর নীল আলো থেকে চোখ দূরে রাখা।',
    commonMistakeBn: '"avoid mobile screen before sleeping" এর জায়গায় পূর্ণাঙ্গ ও মার্জিত বাক্য লিখুন।'
  }
];
