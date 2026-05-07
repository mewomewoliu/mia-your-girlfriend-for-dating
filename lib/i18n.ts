export type Lang = 'en' | 'zh'

export const translations = {
  en: {
    // Welcome
    tagline: "i'm here to help you date smarter\nand feel clearer about love.",
    taglineSub: 'private. personal. just for you.',
    namePlaceholder: "what should i call you? (optional)",
    letsBegin: "let's begin",
    // Birth
    birthIntro: (name: string) => name
      ? `hi ${name}. let's start with\nwhen you were born.`
      : "hi. let's start with\nwhen you were born.",
    birthSub: 'this unlocks your Bazi and astrological chart.',
    birthDate: 'birth date',
    birthTime: 'birth time',
    birthTimeOptional: '(if you know it)',
    birthCity: 'birth city / country',
    birthCityPlaceholder: 'e.g. Shanghai, Singapore, London',
    continue: 'continue',
    // Q1
    q1Title: 'what do you most want\nright now in love?',
    wantOptions: [
      "a deep, lasting connection",
      "clarity on someone i'm seeing",
      "to understand my patterns",
      "to feel more secure in love",
    ],
    q1Custom: 'or type your own...',
    // Q2
    q2Title: "what's one thing you keep\nrepeating in relationships",
    q2Sub: "that you'd like to understand?",
    q2Placeholder: 'i always seem to...',
    // Q3
    q3Title: 'what does feeling safe\nwith someone look like to you?',
    q3Placeholder: 'feeling safe means...',
    q3Error: 'something went wrong generating your chart. please try again.',
    generateChart: 'generate my chart',
    // Generating
    generatingTitle: 'reading your chart...',
    generatingSub: 'exploring your Bazi, Ziwei, and Western signs.',
    // Chart result
    chartIntro: (name: string) => name
      ? `${name}, here's what\nyour chart tells me.`
      : "here's what\nyour chart tells me.",
    labelElement: 'element',
    labelSun: 'sun sign',
    labelZodiac: 'zodiac',
    startTalking: 'start talking to mia',
    // Chat
    yourRelFriend: 'your relationship friend',
    sayAnything: 'say anything...',
    quickReplies: ["tell me more", "that resonates", "i'm not sure"],
    openingMsg: "hi. i'm mia. i've read your chart and i'm already curious about you.\n\nwhat's on your mind?",
    chatError: "i lost my train of thought — could you say that again?",
    // Portrait
    portraitTitle: 'portrait',
    portraitSub: 'what mia knows about you so far',
    yourChart: 'your chart',
    labelSunShort: 'sun',
    whatYouToldMe: 'what you told me when we met',
    wantInLoveLabel: 'what you want in love',
    patternLabel: 'pattern you want to understand',
    safetyLabel: 'what feeling safe looks like',
    patternsNoticed: 'patterns mia has noticed',
    idealPartnerTitle: 'your ideal partner, emerging',
    stillGettingToKnow: 'mia is still getting to know you.',
    patternsEmerge: 'patterns emerge after a few conversations.',
    privacyNote: '🔒 all your data lives only on this device. mia never shares it or uses it for anything outside your own experience.',
    deleteData: 'delete all my data',
    deleteConfirm: 'delete everything and start over?',
    deleteYes: 'yes, delete',
    deleteCancel: 'cancel',
    // Compatibility
    compatTitle: 'compatibility',
    compatSub: 'not a score — a conversation',
    compatFormTitle: "tell me about someone\nyou're curious about.",
    theirName: 'their name',
    nameSuffix: 'first name is enough',
    birthTimeOptionalLabel: '(optional)',
    birthCityOptionalLabel: 'birth city',
    cityPlaceholder: 'city / country',
    generateReading: 'generate reading',
    pastReadings: 'past readings',
    generatingReading: 'reading both your charts...',
    backBtn: '← back',
    youAnd: (name: string) => `you & ${name}`,
    sectionWired: "how you're wired differently",
    sectionAlign: 'where you naturally align',
    sectionAttention: 'where to pay attention',
    sectionChemistry: 'chemistry vs. longevity',
    questionsTitle: 'questions to explore',
    talkToMia: 'talk to mia about this →',
    compatError: 'something went wrong — try again?',
    // NavBar
    navChat: 'chat',
    navCompatibility: 'compatibility',
    navPortrait: 'portrait',
  },
  zh: {
    // Welcome
    tagline: '我在这里，陪你更清醒地谈恋爱，\n更真实地感受爱。',
    taglineSub: '私密。专属。只属于你。',
    namePlaceholder: '我该怎么称呼你？（可选）',
    letsBegin: '开始吧',
    // Birth
    birthIntro: (name: string) => name
      ? `嗨 ${name}，我们从你的出生时间开始。`
      : '嗨，我们从你的出生时间开始。',
    birthSub: '这将解锁你的八字和占星命盘。',
    birthDate: '出生日期',
    birthTime: '出生时间',
    birthTimeOptional: '（如果你知道的话）',
    birthCity: '出生城市 / 国家',
    birthCityPlaceholder: '例如：上海、新加坡、伦敦',
    continue: '继续',
    // Q1
    q1Title: '你现在在爱情里\n最渴望什么？',
    wantOptions: [
      '一段深厚、持久的连接',
      '对目前交往对象的清晰认知',
      '了解自己的情感模式',
      '在爱情中感到更加安心',
    ],
    q1Custom: '或者输入你自己的...',
    // Q2
    q2Title: '在感情里，你总是\n在重复什么？',
    q2Sub: '你希望能理解的那个模式？',
    q2Placeholder: '我好像总是...',
    // Q3
    q3Title: '对你来说，和某人在一起\n有安全感是什么样的？',
    q3Placeholder: '有安全感对我来说意味着...',
    q3Error: '生成命盘时出了些问题，请再试一次。',
    generateChart: '生成我的命盘',
    // Generating
    generatingTitle: '正在解读你的命盘...',
    generatingSub: '探索你的八字、紫微斗数和西方星座。',
    // Chart result
    chartIntro: (name: string) => name
      ? `${name}，这是你的命盘告诉我的。`
      : '这是你的命盘告诉我的。',
    labelElement: '五行',
    labelSun: '太阳星座',
    labelZodiac: '生肖',
    startTalking: '开始与 Mia 对话',
    // Chat
    yourRelFriend: '你的感情知己',
    sayAnything: '说些什么吧...',
    quickReplies: ['再说说', '很有共鸣', '我不太确定'],
    openingMsg: '嗨，我是 Mia。我已经看过你的命盘，对你很好奇。\n\n你现在在想什么？',
    chatError: '我刚才走神了——能再说一遍吗？',
    // Portrait
    portraitTitle: '画像',
    portraitSub: 'Mia 目前了解到的你',
    yourChart: '你的命盘',
    labelSunShort: '太阳',
    whatYouToldMe: '你初次见我时告诉我的',
    wantInLoveLabel: '你对爱情的渴望',
    patternLabel: '你想理解的模式',
    safetyLabel: '安全感对你的意义',
    patternsNoticed: 'Mia 注意到的模式',
    idealPartnerTitle: '你理想伴侣的雏形',
    stillGettingToKnow: 'Mia 还在慢慢了解你。',
    patternsEmerge: '几次对话之后，模式就会浮现。',
    privacyNote: '🔒 你所有的数据都只存储在这台设备上。Mia 绝不会分享或以任何方式使用这些数据。',
    deleteData: '删除我的所有数据',
    deleteConfirm: '删除一切并重新开始？',
    deleteYes: '是的，删除',
    deleteCancel: '取消',
    // Compatibility
    compatTitle: '相容性',
    compatSub: '不是评分——而是一段对话',
    compatFormTitle: '告诉我一个\n你感兴趣的人。',
    theirName: '他 / 她的名字',
    nameSuffix: '名字就够了',
    birthTimeOptionalLabel: '（可选）',
    birthCityOptionalLabel: '出生城市',
    cityPlaceholder: '城市 / 国家',
    generateReading: '生成解读',
    pastReadings: '过往解读',
    generatingReading: '正在解读你们两个的命盘...',
    backBtn: '← 返回',
    youAnd: (name: string) => `你与 ${name}`,
    sectionWired: '你们在哪些方面截然不同',
    sectionAlign: '你们的自然契合点',
    sectionAttention: '需要留意的地方',
    sectionChemistry: '吸引力与长久',
    questionsTitle: '值得探索的问题',
    talkToMia: '与 Mia 聊聊这个 →',
    compatError: '出了些问题——再试一次？',
    // NavBar
    navChat: '聊天',
    navCompatibility: '相容性',
    navPortrait: '画像',
  },
}

export type Translations = typeof translations.en
