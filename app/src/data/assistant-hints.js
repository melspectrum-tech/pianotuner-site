// 网站助手「音叉」的区块提示：page → section id → { zh, en, ask: [[zh, en], …] }。
// 写死在源码里（零延迟、零成本），随 bundle 受 verify-build 的 Gate F 扫描。
// verify-build 另外断言：每个 key 都是构建产物里真实存在的 section id；文案里不出现任何「±」精度数字
// （对话气泡承载不了精度脚注，精度问题交给访客提问、由后端守卫补条件句）。
// 没列出的页面 / 区块：音叉停在页首标题旁，不主动开口。
export const HINTS = {
  index: {
    product: { zh: '这一屏是整体介绍：一个套在弦轴上的执行器，加一个 iPhone App。', en: 'The overview: an actuator that sits on the tuning pin, plus an iPhone app.', ask: [['它和电子调音表有什么不同？', 'How is this different from an electronic tuner?'], ['硬件什么时候能买？', 'When can I buy the hardware?']] },
    'how-it-works': { zh: '三步走完一次调律：装上、生成曲线、自动微调。', en: 'One tuning in three steps: mount it, build the curve, let it fine-tune.', ask: [['需要懂调律吗？', 'Do I need to know how to tune?'], ['曲线是在哪里算的？', 'Where is the curve computed?']] },
    waitlist: { zh: '想在开售时收到通知，在这里留邮箱就行，不用付款。', en: 'Leave your email here to hear when sales open. No payment involved.', ask: [['候补名单会收到什么邮件？', 'What emails will the waitlist get?'], ['大概什么时候开售？', 'Roughly when do sales open?']] },
    faq: { zh: '安全、精度、适配这些常见疑问，都在这一块。', en: 'Safety, accuracy and compatibility questions all live here.', ask: [['会不会把琴弦弄断？', 'Could it break a string?'], ['我的钢琴能用吗？', 'Will it work on my piano?']] },
    engine: { zh: '这里讲 App 怎么听音，尤其是最难的低音区。', en: 'How the app listens, especially in the tricky bass range.', ask: [['什么是拍频？', 'What are beats?'], ['嘈杂环境也能用吗？', 'Does it work in a noisy room?']] },
    software: { zh: 'App 现在就能在 TestFlight 装，不等硬件也能用。', en: 'The app is on TestFlight now and works before the hardware arrives.', ask: [['没有硬件时 App 能做什么？', 'What does the app do without the hardware?'], ['支持 Android 吗？', 'Is there an Android version?']] },
    features: { zh: '硬件这边的几项设计取舍，都在这一块。', en: 'The design choices on the hardware side.', ask: [['设备声音大吗？', 'Is the device loud?'], ['为什么把算力放在手机上？', 'Why does the phone do the computing?']] },
    'for-you': { zh: '这块讲怎么让零基础的人也能用好。', en: 'How it stays usable even with zero tuning experience.', ask: [['调律数据会上传吗？', 'Is my tuning data uploaded?'], ['能管理好几台琴吗？', 'Can I manage several pianos?']] },
    railsback: { zh: '这里是可选的 Railsback 曲线服务，基础调音不需要它。', en: 'The optional Railsback curve service. Basic tuning works without it.', ask: [['Railsback 曲线是什么？', 'What is the Railsback curve?'], ['不订阅能用吗？', 'Can I use it without subscribing?']] },
    technology: { zh: '底层架构：固件怎么更新、曲线怎么在本机生成。', en: 'The architecture: how firmware updates and how curves are built on-device.', ask: [['更新固件要拆机吗？', 'Do firmware updates need disassembly?'], ['需要联网吗？', 'Does it need the internet?']] },
    compare: { zh: '和传统人工调律逐项对比，看看差在哪。', en: 'A side-by-side with traditional hand tuning.', ask: [['它能完全替代调律师吗？', 'Can it fully replace a tuner?'], ['哪一项最值得看？', 'Which row matters most?']] },
    roi: { zh: '对调律师和琴主，各自省下的是什么。', en: 'What it saves for tuners and for piano owners.', ask: [['我是调律师，适合我吗？', "I'm a tuner. Is this for me?"], ['家用值得吗？', 'Is it worth it for home use?']] },
    roadmap: { zh: '从第一版原型到现在的迭代记录。', en: 'The path from the first prototype to now.', ask: [['现在做到哪一步了？', 'Where are things now?'], ['首批什么时候发货？', 'When does the first batch ship?']] },
    join: { zh: '看到这儿了——有哪里没讲清楚吗？告诉我，我记下来给团队。', en: "You've made it to the end. Anything unclear? Tell me and I'll pass it to the team.", ask: [['我有个建议', 'I have a suggestion'], ['我想联系创始人', "I'd like to reach the founder"]] },
  },
  pro: {
    railsback: { zh: '专业版的核心：按每台琴实测数据拟合专属曲线。', en: 'The heart of Pro: a curve fitted to each piano from measured data.', ask: [['B 值是什么？', 'What is the B value?'], ['标准版也有曲线吗？', 'Does the standard edition get a curve?']] },
    features: { zh: '专业版独有的六项功能。', en: 'The six Pro-only features.', ask: [['Turbo 模式快多少？', 'How much faster is Turbo?'], ['支持哪些历史律制？', 'Which historical temperaments?']] },
    comparison: { zh: '标准版和专业版逐项对比。', en: 'Standard vs Pro, row by row.', ask: [['我该选哪个版本？', 'Which edition should I pick?'], ['专业版怎么收费？', 'How is Pro priced?']] },
    cta: { zh: '看完了专业版，有哪里没讲清楚吗？我可以记下来。', en: 'Done with Pro? Anything unclear? I can note it down.', ask: [['我有个建议', 'I have a suggestion'], ['我想联系创始人', "I'd like to reach the founder"]] },
  },
  about: {
    product: { zh: '公司做的东西：硬件、App、云端三部分。', en: 'What the company builds: hardware, app and cloud.', ask: [['云端存了哪些数据？', 'What does the cloud store?'], ['公司在哪里？', 'Where is the company based?']] },
    team: { zh: '这是创始团队。想直接找创始人，我可以帮你转交。', en: 'The founding team. Want to reach the founder? I can pass your message on.', ask: [['我想联系创始人', "I'd like to reach the founder"], ['你们在招人吗？', 'Are you hiring?']] },
  },
  buy: {
    top: { zh: '现在暂停销售，可以先留邮箱等开售通知。', en: 'Sales are paused. Leave your email to hear when they reopen.', ask: [['价格是多少？', "What's the price?"], ['首批什么时候发货？', 'When does the first batch ship?']] },
  },
  guides: {
    top: { zh: '这些是调律知识的长文，每篇都附出处。', en: 'Long-form tuning articles, each with sources.', ask: [['先读哪一篇？', 'Which one should I read first?'], ['什么是拉伸调律？', 'What is stretch tuning?']] },
  },
};

