import { useT } from '../../i18n';
import LegalPage from '../../components/LegalPage';
import { EMAIL_SUPPORT, UMAMI_WEBSITE_ID } from '../../data/site';

export const meta = {
  published: '2026-09-05',
  updated: '2026-10-23',
  navTheme: 'dark',
  zh: { title: '隐私政策 | Piano Tuner', desc: 'Piano Tuner 隐私政策 — 麦克风仅用于本地音高检测，不录音、不上传音频；两项匿名数据贡献默认开启，可随时在应用内关闭。' },
  en: { title: 'Privacy Policy | Piano Tuner', desc: 'Piano Tuner privacy policy: microphone used only for on-device pitch detection, no audio recorded or uploaded; two anonymous data contributions are on by default and can be switched off in the app at any time.' },
  jsonLd: (lang, { self }) => ({ '@context': 'https://schema.org', '@type': 'WebPage', url: self, name: lang === 'en' ? 'Privacy Policy' : '隐私政策' }),
};

export default function Privacy() {
  const { t } = useT();
  const P = ({ children }) => <p className="t-body">{children}</p>;
  const H = ({ children }) => <h3 className="t-ui" style={{ margin: '14px 0 6px', color: 'var(--color-ash)' }}>{children}</h3>;
  const sections = [
    { title: t('我们收集哪些信息', 'What we collect'), body: <>
      <H>{t('麦克风（音频）', 'MICROPHONE (AUDIO)')}</H>
      <P>{t('本产品需要访问麦克风，仅用于在您的设备上实时检测琴弦音高。音频流被实时分析后即丢弃，不会被录制、保存或上传。我们只处理从音频中提取的频率信息，不会留存任何录音。', 'The Product requests microphone access solely to detect string pitch in real time, on your device. The audio stream is analyzed live and then discarded — it is never recorded, stored, or uploaded. We only work with the frequency information derived from the sound; no recordings are kept.')}</P>
      <H>{t('蓝牙（BLE）', 'BLUETOOTH (BLE)')}</H>
      <P>{t('我们使用低功耗蓝牙仅为连接调音硬件设备。连接过程中涉及的设备标识符仅用于建立和维持与硬件的连接，不用于追踪您或在不同应用间识别您。', 'We use Bluetooth Low Energy only to connect to the tuning hardware. Any device identifiers involved are used purely to establish and maintain the connection to the hardware, and are not used to track you or identify you across apps.')}</P>
      <H>{t('应用标识', 'APP IDENTIFIER')}</H>
      <P>{t('应用首次运行时会生成一个随机的用户标识，用来关联您的钢琴档案和专业版授权。如果您登录了 iCloud，这个标识会通过 Apple 的 iCloud 键值存储在您自己的设备之间同步，以便换设备后找回钢琴档案。它不包含您的姓名、Apple ID 或联系方式。', 'On first run the app generates a random user identifier, used to link your piano profiles and Pro licence. If you are signed in to iCloud, this identifier is synced between your own devices through Apple\'s iCloud key-value storage, so your piano profiles follow you to a new device. It does not contain your name, Apple ID or contact details.')}</P>
      <H>{t('钢琴档案', 'PIANO PROFILES')}</H>
      <P>{t('您可以为每台钢琴创建档案（昵称、品牌、型号、年份，以及选填的序列号、年代与档次）。档案先保存在您的设备上，同时与上述用户标识一起登记到我们的云端，以便同步和找回。请不要在昵称里填写他人姓名、地址等个人信息。', 'You may create a profile for each piano (nickname, brand, model, year, and optionally serial number, era and grade). Profiles are saved on your device and also registered to our cloud together with the user identifier above, so they can be synced and recovered. Please do not put other people\'s names, addresses or other personal details in a nickname.')}</P>
      <H>{t('钢琴测量数据', 'PIANO MEASUREMENT DATA')}</H>
      <P>{t('为生成专属调律曲线，本产品会测量您钢琴的声学特性（如各音的不谐和度、泛音结构等）。这些测量结果在您的设备上加密后，才会上传到云端备份，以便下次免去重新采集；解密密钥保存在您的 iCloud 钥匙串中，我们无法读取其内容，只能看到采集时间、音符数量等少量元数据。', 'To generate a personalized tuning curve, the Product measures the acoustic properties of your piano (such as inharmonicity and harmonic structure per note). These measurements are encrypted on your device before being backed up to our cloud, so you do not have to measure again next time. The decryption key is kept in your iCloud Keychain; we cannot read the contents and see only a little metadata, such as when the measurement was taken and how many notes it covers.')}</P>
      <H>{t('授权与调律会话', 'LICENCE AND TUNING SESSIONS')}</H>
      <P>{t('如果您激活了专业版，应用每次启动时会把激活码和用户标识发给服务器，核验订阅是否有效。每次开始调律时，应用会向服务器登记一次会话，内容是您的版本档位、标准音高和所选律制。', 'If you have activated Pro, the app sends your activation code and user identifier to our server on each launch to check that the subscription is valid. Each time you start tuning, the app registers a session with our server containing your tier, the reference pitch and the chosen temperament.')}</P>
      <H>{t('数据贡献：识别数据（默认开启，可关闭）', 'DATA CONTRIBUTION: DETECTION DATA (ON BY DEFAULT, CAN BE TURNED OFF)')}</H>
      <P>{t('为了让音高识别更准，应用默认会上传调律过程中的声学特征与识别结果：各音的频率估值、不谐和度、泛音强度、算法置信度、环境噪声估计、您最终接受的音分结果，以及一份调律报告（各音调后频率与偏差、电机运行数据、总评分）。随数据一起上传的还有手机型号、钢琴类型、App 与算法版本、标准音高与律制，以及用于去重和关联的随机安装标识、会话标识和钢琴标识。这些数据不包含录音、姓名、联系方式或位置。', 'To make pitch detection more accurate, the app by default uploads acoustic features and detection results from your tuning sessions: per-note frequency estimates, inharmonicity, harmonic strengths, algorithm confidence, an ambient-noise estimate, the cent values you finally accepted, and a tuning report (per-note frequency and deviation after tuning, motor operating data and overall score). These are sent with your phone model, piano type, app and algorithm versions, reference pitch and temperament, plus a random installation ID, session ID and piano ID used to de-duplicate and link records. This data contains no recordings, names, contact details or location.')}</P>
      <H>{t('数据贡献：调律曲线（默认开启，可关闭）', 'DATA CONTRIBUTION: TUNING CURVES (ON BY DEFAULT, CAN BE TURNED OFF)')}</H>
      <P>{t('每完成一次调律，应用默认会上传这台钢琴的拉伸调律曲线（Railsback 曲线）和各音不谐和度，连同钢琴品牌、型号、年份、调音顺序与电机运行数据、调律风格、标准音高与律制、iOS 与 App 版本，以及钢琴标识，用于改进调律算法。不包含您给钢琴起的昵称或序列号。', 'After each completed tuning, the app by default uploads the piano\'s stretch tuning curve (Railsback curve) and per-note inharmonicity, together with the piano\'s brand, model and year, the tuning order and motor operating data, tuning style, reference pitch and temperament, iOS and app versions, and the piano ID, to improve our tuning algorithm. It does not include the nickname you gave the piano or its serial number.')}</P>
      <P>{t('这两项在新安装的应用里默认开启，首次启动时会有一页说明，您可以当场关闭；之后也可以随时在连接页的「数据贡献」里分别关闭。关闭后，应用不再收集此类数据，尚未发出的数据也不会再上传。在本次更新之前安装、此前没有主动开启的用户，设置保持不变。', 'Both are on by default in new installations. A notice page on first launch explains them and lets you switch them off right away; you can also switch either off at any time under Data contribution on the connect screen. Once switched off, the app stops collecting that data and no longer uploads anything not yet sent. If you installed the app before this update and had not turned these on, your settings are unchanged.')}</P>
      <H>{t('访问日志', 'ACCESS LOGS')}</H>
      <P>{t('与任何网络服务一样，我们的服务器会记录请求的 IP 地址与时间，用于安全防护和防止滥用。', 'Like any online service, our servers log the IP address and time of requests, for security and abuse prevention.')}</P>
    </> },
    { title: t('我们如何使用信息', 'How we use information'), body: <ul className="t-body">
      <li>{t('实时检测音高并驱动调音硬件完成调律。', 'Detect pitch in real time and drive the tuning hardware.')}</li>
      <li>{t('基于您钢琴的测量数据，在设备上计算专属的个性化调律曲线，并记录调音会话的进度。', "Compute a personalized tuning curve on your device from your piano's measurements and track the progress of a tuning session.")}</li>
      <li>{t('保存、同步并复用钢琴档案与测量结果，让下一次调音更省事。', 'Save, sync and reuse piano profiles and measurements to make the next tuning faster.')}</li>
      <li>{t('核验专业版授权，检查固件更新。', 'Verify your Pro licence and check for firmware updates.')}</li>
      <li>{t('（数据贡献开启时）用识别数据和调律曲线排查问题、改进识别与调律算法。', '(When data contribution is on) Diagnose issues and improve our detection and tuning algorithms using detection data and tuning curves.')}</li>
    </ul> },
    { title: t('云端服务、存放地点与第三方', 'Cloud service, location and third parties'), body: <>
      <P>{t('个性化调律曲线在您的设备本机计算，基础调音不依赖网络。上文所述需要上传的数据，发送到我们的云端服务 api.pianotuner.top。', 'Your personalized tuning curve is computed on your device, and basic tuning does not need a network connection. Data that is uploaded as described above goes to our cloud service, api.pianotuner.top.')}</P>
      <P>{t('存放地点：我们的服务器位于美国洛杉矶（由云主机服务商 RackNerd 提供机房），访问经 Cloudflare 网络加密转发。因此，您在中国境内使用本产品时，上传的数据会传输到境外存储和处理。您可以按下文「联系我们」中的方式，就境外处理的数据行使查阅、更正、删除等权利。', 'Location: our servers are in Los Angeles, United States (hosting provided by RackNerd), and traffic reaches them through Cloudflare\'s network over encrypted connections. If you use the Product from mainland China, uploaded data is therefore transferred to and processed outside China. You can exercise your rights of access, correction and deletion over that data using the contact details below.')}</P>
      <P>{t('我们用到的第三方服务：Apple（iCloud 键值存储与钥匙串，用于在您自己的设备间同步用户标识和加密密钥）、Cloudflare（网络加速与防护）、RackNerd（服务器托管）。它们只为提供上述服务处理数据。', 'Third-party services we rely on: Apple (iCloud key-value storage and Keychain, to sync your user identifier and encryption key between your own devices), Cloudflare (network delivery and protection) and RackNerd (server hosting). They process data only to provide those services.')}</P>
    </> },
    { title: UMAMI_WEBSITE_ID ? t('本网站：候补名单与访问统计', 'This website: waitlist and visit statistics') : t('本网站：候补名单', 'This website: waitlist'), body: <>
      <H>{t('候补名单', 'WAITLIST')}</H>
      <P>{t('当您在本网站加入候补名单时，我们会收到您的邮箱、提交所在页面、页面语言、您选填的身份（如有）、提交时间，以及提交请求的 IP 地址（用于防止滥用）。这些信息只用于发送确认邮件、开售通知与重要产品进展，不会用于广告。确认邮件经腾讯企业邮箱发送；每条新登记也会以邮件形式通知我们的团队（由公司邮箱接收，服务商为阿里邮箱企业版）。信息保存至您要求退出，或候补名单计划结束后删除；如需退出或删除，写信给我们即可。', 'When you join the waitlist on this website, we receive your email, the page and language of submission, the role you optionally select, the time, and the IP address of the request (to prevent abuse). We use this only to send a confirmation, the sales-open notice and important product updates — never for advertising. Confirmation emails are sent through Tencent Exmail, and each new sign-up is also sent to our team by email (received at our company mailbox, hosted by Alibaba Mail). We keep this information until you ask to be removed or the waitlist programme ends; to opt out or have it deleted, just email us.')}</P>
      {UMAMI_WEBSITE_ID ? <>
        <H>{t('访问统计', 'VISIT STATISTICS')}</H>
        <P>{t('我们使用部署在自有服务器上的开源统计工具 Umami，收集页面访问量、按钮点击、来源页面、由 IP 推算的大致位置（国家、地区、城市）、设备与浏览器类型、屏幕尺寸和语言等统计信息。它不使用 Cookie，不做跨站追踪，数据不与任何第三方共享。', 'We use Umami, an open-source analytics tool running on our own server, to collect statistics such as page views, button clicks, referring pages, approximate location derived from IP (country, region, city), device and browser type, screen size and language. It sets no cookies, does no cross-site tracking, and the data is not shared with any third party.')}</P>
      </> : null}
    </> },
    { title: t('信息共享', 'Sharing'), body: <>
      <P>{t('我们不出售您的个人数据，也不进行第三方广告追踪。', 'We do not sell your personal data, and we do not use third-party advertising trackers.')}</P>
      <P>{t('我们仅在以下情形共享信息：为运行上述云端服务与发送候补名单邮件所必需的技术服务商（在我们的指示下处理数据）；或法律法规要求时。除此之外，我们不会向任何第三方披露您的数据。', 'We share information only where necessary: with technical service providers required to operate the cloud service and send waitlist emails described above (processing data under our instructions), or when required by law. We do not otherwise disclose your data to any third party.')}</P>
    </> },
    { title: t('存储、保留与安全', 'Storage, retention & security'), body: <>
      <P>{t('调律曲线的计算、钢琴档案与本地设置都保存在您的设备上。发送到云端的数据全程加密传输。钢琴档案与加密测量结果保留到您要求删除为止；数据贡献收到的数据会在改进算法所需的期间内保留，您可以随时来信要求删除。', 'Curve computation, piano profiles and local settings are kept on your device. Data sent to the cloud is encrypted in transit. Piano profiles and encrypted measurements are kept until you ask us to delete them; data received through data contribution is kept for as long as it is needed to improve our algorithms, and you can ask us to delete it at any time.')}</P>
      <P>{t('我们采取合理的技术与组织措施保护数据，但请注意，任何通过互联网传输或存储的方式都无法做到绝对安全。', 'We apply reasonable technical and organizational safeguards, but please note that no method of transmission or storage over the internet is perfectly secure.')}</P>
    </> },
    { title: t('您的选择与权利', 'Your choices & rights'), body: <>
      <P>{t('授权控制：麦克风与蓝牙权限可在系统设置中随时撤销；两项数据贡献可在应用连接页的「数据贡献」里随时分别关闭。', 'Permission control: microphone and Bluetooth access can be revoked at any time in system settings; each of the two data contributions can be switched off at any time under Data contribution on the app\'s connect screen.')}</P>
      <P>{t('访问、更正与删除：您可以在应用中查看或修改您输入的钢琴档案。如需访问、更正、删除与您相关的数据（包括存放在境外服务器上的数据），或撤回同意，请通过下方邮箱联系我们。', 'Access, correction & deletion: you can view or edit the piano profiles you entered in the app. To access, correct or delete data relating to you (including data held on servers outside China), or to withdraw consent, contact us at the email below.')}</P>
    </> },
    { title: t('儿童', 'Children'), body: <P>{t('本产品不面向儿童设计，也不会有意收集儿童的个人信息。', 'The Product is not directed at children, and we do not knowingly collect personal information from children.')}</P> },
    { title: t('政策变更', 'Changes to this policy'), body: <P>{t('我们可能会不时更新本隐私政策。重大变更将通过应用内或本页面公示，并更新顶部的「最后更新」日期。继续使用本产品即表示您接受更新后的政策。', 'We may update this Privacy Policy from time to time. Material changes will be posted in the app or on this page, with the "Last updated" date above revised accordingly. Continued use of the Product means you accept the updated policy.')}</P> },
    { title: t('联系我们', 'Contact us'), body: <P>{t('如对本隐私政策有任何疑问，或希望行使您的权利，请联系：', 'For any questions about this Privacy Policy, or to exercise your rights, contact us at: ')}<a className="literal" href={`mailto:${EMAIL_SUPPORT}`}>{EMAIL_SUPPORT}</a></P> },
  ];
  return (
    <LegalPage
      page="privacy"
      kicker={t('LEGAL · 法律条款', 'LEGAL')}
      title={t('隐私政策', 'Privacy policy')}
      updated={t('最后更新：2026 年 10 月 23 日', 'Last updated: October 23, 2026')}
      intro={t('本隐私政策说明融谱智能科技（深圳）有限公司（品牌 MelSpectrum / Piano Tuner，以下简称「我们」）在您使用 Piano Tuner 调音机器人及配套 iOS 应用（以下统称「本产品」）以及访问本网站时，如何收集、使用和保护信息。我们坚持数据最小化原则：调律计算在您的设备本地完成，只上传本政策列明的数据。', 'This Privacy Policy explains how 融谱智能科技（深圳）有限公司, operating under the MelSpectrum brand (Piano Tuner; "we", "us") collects, uses, and protects information when you use the Piano Tuner tuning robot and its companion iOS app (together, the "Product") and when you visit this website. We follow a data-minimization principle: tuning calculations run locally on your device, and we upload only the data listed in this policy.')}
      sections={sections}
    />
  );
}
