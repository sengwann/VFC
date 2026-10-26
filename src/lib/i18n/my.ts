import type { TranslationKey } from "./en";

export const my: Record<TranslationKey, string> = {
  // Navigation
  "nav.dashboard": "ဒက်ရှ်ဘုတ်",
  "nav.houses": "အိမ်များ",
  "nav.members": "အိမ်ထောင်စုဝင်များ",
  "nav.collectors": "ကောက်ခံသူများ",
  "nav.funds": "ရန်ပုံငွေများ",
  "nav.receipts": "ပြေစာများ",
  "nav.cash": "ငွေသား",
  "nav.disputes": "အငြင်းပွားမှုများ",
  "nav.settings": "ဆက်တင်များ",
  "nav.logout": "ထွက်ရန်",
  "nav.platformAudit": "ပလက်ဖောင်း စာရင်းစစ်",
  "nav.villages": "ကျေးရွာများ",
  "nav.auditLog": "စာရင်းစစ် မှတ်တမ်း",

  // Shell
  "shell.platformAdmin": "ပလက်ဖောင်း အက်မင်",
  "shell.villageFundCollection": "ကျေးရွာ ရန်ပုံငွေ စနစ်",
  "shell.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "shell.villageId": "ကျေးရွာ ID",
  "shell.pendingBanner":
    "သင့်အိမ်ထောင်စု အဖွဲ့ဝင်အခြေအနေသည် အတည်ပြုချက် စောင့်ဆိုင်းနေပါသည်။ အိမ်ထောင်စုခေါင်းဆောင်က အတည်ပြုပြီးသည်အထိ အချို့သော လုပ်ဆောင်ချက်များ အသုံးပြု၍ မရပါ။",
  "shell.pendingTitle": "အဖွဲ့ဝင်ခွင့် အတည်ပြုချက် စောင့်ဆိုင်းနေသည်",
  "shell.skipToContent": "အဓိက အကြောင်းအရာသို့ ကျော်ရန်",
  "shell.mainNavigation": "အဓိက မီနူး",
  "shell.menu": "မီနူး",
  "shell.closeMenu": "မီနူး ပိတ်ရန်",
  "shell.account": "အကောင့်",
  "shell.unavailable": "မရနိုင်သေးပါ",
  "shell.hasAlerts": "အာရုံစိုက်ရန် ရှိသည်",
  "shell.role.systemAdmin": "စနစ် အက်မင်",
  "shell.role.chief": "ကျေးရွာ အုပ်ချုပ်ရေးမှူး",
  "shell.role.villager": "ကျေးရွာသား",
  "shell.membership.active": "လက်ရှိ အဖွဲ့ဝင်",
  "shell.membership.pending": "စောင့်ဆိုင်းဆဲ",
  "shell.membership.rejected": "ပယ်ချခံရသည်",
  "shell.membership.removed": "ဖယ်ရှားခံရသည်",
  "shell.attention.title": "အာရုံစိုက်ရန်",
  "shell.attention.view": "ကြည့်ရန်",
  "shell.attention.disputesOne":
    "အငြင်းပွားမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.disputesOther":
    "အငြင်းပွားမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.noCollector":
    "လက်ရှိကာလအတွက် တာဝန်ပေးထားသော ကောက်ခံသူ မရှိပါ",
  "shell.attention.noFund": "အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ — ငွေကောက်ခံ၍ မရပါ",
  "shell.attention.membersOne":
    "အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှု {count} ခု စောင့်ဆိုင်းနေသည်",
  "shell.attention.membersOther":
    "အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှု {count} ခု စောင့်ဆိုင်းနေသည်",
  "shell.chief.title": "ကျေးရွာ အုပ်ချုပ်ရေးမှူး",
  "shell.chief.name": "အမည်",
  "shell.chief.phone": "ဖုန်း",
  "shell.chief.call": "ဖုန်းခေါ်ရန်",
  "shell.comingSoon": "မကြာမီ ရောက်ရှိမည်",
  "shell.soon": "မကြာမီ",
  "settings.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "settings.accountNote":
    "ရာထူး၊ ကျေးရွာ၊ အိမ်နှင့် အဖွဲ့ဝင်အခြေအနေတို့ကို ကျေးရွာ အုပ်ချုပ်ရေးမှူးများက စီမံပြီး ဤနေရာတွင် ပြင်ဆင်၍ မရပါ။",

  // Settings page
  "settings.title": "ဆက်တင်များ",
  "settings.subtitle": "သင့်အကောင့်၊ လုံခြုံရေးနှင့် ဦးစားပေးများကို စီမံပါ။",
  "settings.backToDashboard": "ဒက်ရှ်ဘုတ်သို့ ပြန်ရန်",
  "settings.accountInfo": "အကောင့် အချက်အလက်",
  "settings.role": "ရာထူး",
  "settings.village": "ကျေးရွာ",
  "settings.house": "အိမ်",
  "settings.membershipStatus": "အဖွဲ့ဝင်အခြေအနေ",
  "settings.readOnlyNote":
    "ရာထူး၊ ကျေးရွာ၊ အိမ်နှင့် အဖွဲ့ဝင်အခြေအနေတို့ကို ကျေးရွာ အုပ်ချုပ်ရေးမှူးများက စီမံပြီး ဤနေရာတွင် ပြင်ဆင်၍ မရပါ။",
  "settings.editProfile": "ပရိုဖိုင် တည်းဖြတ်ရန်",
  "settings.changePassword": "စကားဝှက် ပြောင်းရန်",
  "settings.preferences": "ဦးစားပေးများ",
  "settings.appearance": "အသွင်အပြင်",
  "settings.appearanceHint":
    "ချက်ချင်း ပြောင်းလဲပြီး ဤစက်တွင်သာ သိမ်းဆည်းထားသည်။",
  "settings.language": "ဘာသာစကား",
  "settings.saveSettings": "ဆက်တင်များ သိမ်းရန်",
  "settings.saving": "သိမ်းဆည်းနေသည်...",

  // Profile form
  "profile.name": "အမည်",
  "profile.email": "အီးမေးလ်",
  "profile.phone": "ဖုန်း",
  "profile.saveProfile": "ပရိုဖိုင် သိမ်းရန်",
  "profile.saving": "သိမ်းဆည်းနေသည်...",
  "profile.identifierError":
    "အနည်းဆုံး ဝင်ရောက်မှု နည်းလမ်း တစ်ခု ပေးပါ - အီးမေးလ် သို့မဟုတ် ဖုန်း။",

  // Password form
  "password.current": "လက်ရှိ စကားဝှက်",
  "password.new": "စကားဝှက် အသစ်",
  "password.confirm": "စကားဝှက် အသစ် အတည်ပြုရန်",
  "password.change": "စကားဝှက် ပြောင်းရန်",
  "password.changing": "ပြောင်းလဲနေသည်...",
  "password.hint": "အနည်းဆုံး ၈ လုံးမှ အများဆုံး ၇၂ လုံး ဖြစ်ရပါမည်။",
  "password.success": "စကားဝှက် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။",

  // Theme options
  "theme.light": "အလင်း",
  "theme.dark": "အမှောင်",
  "theme.system": "စနစ်",

  // Language options
  "language.en": "English",
  "language.my": "မြန်မာ",

  // Common
  "common.loading": "ဖတ်နေသည်...",
  "common.error": "တစ်ခုခု မှားယွင်းသွားပါသည်။ ထပ်ကြိုးစားပါ။",
  "common.save": "သိမ်းရန်",
  "common.cancel": "ပယ်ဖျက်ရန်",
  "common.back": "နောက်သို့",

  // Login
  "login.title": "ဝင်ရောက်ရန်",
  "login.subtitle":
    "ဆက်လက်ရန် အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ်နှင့် စကားဝှက်ကို ထည့်ပါ။",
  "login.villageCodeHint":
    "စနစ်စီမံသူ (System Admin) မဟုတ်ပါက ကျေးရွာကုဒ်ကို ဖြည့်ပါ။",
  "passwordRequired.title": "စကားဝှက်အသစ် ရွေးချယ်ပါ",
  "passwordRequired.body":
    "သင့်အကောင့်ကို ကနဦးစကားဝှက်ဖြင့် ဖန်တီးထားခြင်း ဖြစ်ပါသည်။ ဆက်မသွားမီ ၎င်းကို ပြောင်းလဲပါ။",
  "passwordRequired.hint":
    "လက်ရှိစကားဝှက်နေရာတွင် သင့်အား ပေးထားသော ကနဦးစကားဝှက်ကို ထည့်ပါ။",
  "login.identifier": "အီးမေးလ် သို့မဟုတ် ဖုန်း",
  "login.identifierPlaceholder": "you@example.com သို့မဟုတ် 09xxxxxxx",
  "login.password": "စကားဝှက်",
  "login.showPassword": "စကားဝှက် ပြရန်",
  "login.hidePassword": "စကားဝှက် ဖျောက်ရန်",
  "login.submit": "ဝင်ရောက်ရန်",
  "login.submitting": "ဝင်ရောက်နေသည်...",
  "login.registeredTitle": "စာရင်းသွင်းမှု အောင်မြင်ပါသည်",
  "login.registeredBody": "ကျေးဇူးပြု၍ ဝင်ရောက်ပါ။",
  "login.errorTitle": "ဝင်ရောက်၍ မရပါ",
  "login.errorInvalid":
    "အချက်အလက် မမှန်ကန်ပါ။ အီးမေးလ် သို့မဟုတ် ဖုန်းနှင့် စကားဝှက်ကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",

  "login.errorThrottled":
    "ဝင်ရောက်ရန် ကြိုးစားမှု များလွန်းနေပါသည်။ ကျေးဇူးပြု၍ {minutes} မိနစ်ခန့်အကြာတွင် ထပ်ကြိုးစားပါ။",
  "login.noAccount": "အကောင့် မရှိသေးဘူးလား။",
  "login.createAccount": "အကောင့် ဖွင့်ရန်",
  "login.language": "ဘာသာစကား",
  "login.brandTagline":
    "ကျေးရွာ ရန်ပုံငွေများကို ရှင်းလင်းပြီး တာဝန်ခံမှုရှိစွာ စီမံခြင်း။",
  "login.brandPointPay":
    "ငွေပေးချေမှု မှတ်တမ်းများနှင့် ပြေစာများကို လွယ်ကူစွာ ခြေရာခံနိုင်သည်",
  "login.brandPointReceipts": "ပြေစာများကို အချိန်မရွေး ပြန်ကြည့်နိုင်သည်",
  "login.brandPointVillage":
    "အိမ်ထောင်စုများ၊ ကောက်ခံသူများနှင့် ရန်ပုံငွေများကို တစ်နေရာတည်းတွင် စီမံနိုင်သည်",

  // Signup and villager registration
  "signup.stepOf": "အဆင့် {current} / {total}",
  "signup.stepsLabel": "စာရင်းသွင်းမှု တိုးတက်မှု",
  "signup.stepVillage": "ကျေးရွာကုဒ်",
  "signup.stepDetails": "သင့်အချက်အလက်",
  "signup.codeTitle": "သင့်ကျေးရွာသို့ ဝင်ရောက်ရန်",
  "signup.codeSubtitle":
    "စာရင်းသွင်းရန် ကျေးရွာ အုပ်ချုပ်ရေးမှူးထံမှ ရရှိသော ကျေးရွာကုဒ်ကို ထည့်ပါ။",
  "signup.codeLabel": "ကျေးရွာကုဒ်",
  "signup.codePlaceholder": "ဥပမာ - DEV100",
  "signup.codeHint":
    "ကျေးရွာကုဒ်ကို သင့်ကျေးရွာ အုပ်ချုပ်ရေးမှူးထံမှ ရယူနိုင်သည်။",
  "signup.codeSubmit": "ဆက်လက်ရန်",
  "signup.codeChecking": "ကျေးရွာကုဒ် စစ်ဆေးနေသည်...",
  "signup.invalidCode": "ကျေးရွာကုဒ် မမှန်ကန်ပါ။ စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "signup.haveAccount": "အကောင့် ရှိပြီးသားလား။",
  "signup.signIn": "ဝင်ရောက်ရန်",
  "signup.registerTitle": "အကောင့် ဖွင့်ရန်",
  "signup.registerSubtitle":
    "ကျေးရွာသား အကောင့်ဖွင့်ပြီး အိမ်တစ်အိမ်သို့ ဝင်ရောက်ပါ။",
  "signup.village": "သင့်ကျေးရွာ",
  "signup.changeVillage": "ကျေးရွာ ပြောင်းရန်",
  "signup.sectionAbout": "သင့်အကြောင်း",
  "signup.name": "အမည်အပြည့်အစုံ",
  "signup.dob": "မွေးသက္ကရာဇ်",
  "signup.optional": "မဖြည့်လည်းရ",
  "signup.dobHint": "နောက်မှ ဆက်တင်များတွင် ထည့်နိုင်သည်။",
  "signup.sectionSignIn": "ဝင်ရောက်မည့် နည်းလမ်း",
  "signup.signInIntro":
    "အီးမေးလ်၊ ဖုန်းနံပါတ် သို့မဟုတ် နှစ်မျိုးလုံး ထည့်ပါ။ အနည်းဆုံး တစ်မျိုး လိုအပ်ပါသည်။",
  "signup.email": "အီးမေးလ်",
  "signup.phone": "ဖုန်းနံပါတ်",
  "signup.phonePlaceholder": "09xxxxxxx",
  "signup.password": "စကားဝှက်",
  "signup.submit": "အကောင့် ဖွင့်ရန်",
  "signup.sectionHouse": "သင့်အိမ်",
  "signup.houseNumber": "အိမ်နံပါတ်",
  "signup.housePlaceholder": "အိမ်နံပါတ် ရွေးပါ",
  "signup.houseHint":
    "ကျေးရွာ အုပ်ချုပ်ရေးမှူး ဖန်တီးထားသော အိမ်နံပါတ်ကို ရွေးပါ။",
  "signup.houseNote":
    "စာရင်းသွင်းသူအားလုံးသည် အတည်ပြုချက်ကို စောင့်ရပါမည်။ အိမ်တွင် အိမ်ထောင်စုခေါင်းဆောင် မရှိသေးပါက ကျေးရွာ အုပ်ချုပ်ရေးမှူးက ခေါင်းဆောင်ကို ရွေးချယ်ပါမည်။ ရှိပြီးသားဖြစ်ပါက အိမ်ထောင်စုခေါင်းဆောင်က အတည်ပြုပါမည်။",
  "signup.submitting": "အကောင့် ဖွင့်နေသည်...",
  "signup.errorTitle": "အကောင့် ဖွင့်၍ မရပါ",
  "signup.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "signup.err.name": "အမည်သည် အက္ခရာ ၂ လုံးမှ ၁၀၀ လုံးအတွင်း ဖြစ်ရပါမည်။",
  "signup.err.email": "အီးမေးလ် မမှန်ကန်ပါ။",
  "signup.err.phone": "ဖုန်းနံပါတ် မမှန်ကန်ပါ။",
  "signup.err.identifier":
    "အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ် အနည်းဆုံး တစ်ခု ထည့်ပါ။",
  "signup.err.password":
    "စကားဝှက်သည် အက္ခရာ ၈ လုံးမှ ၇၂ လုံးအတွင်း ဖြစ်ရပါမည်။",
  "signup.err.passwordBytes":
    "စကားဝှက် အရမ်းရှည်နေပါသည်။ မြန်မာအက္ခရာတစ်လုံးလျှင် ၃ ဘိုက်ယူသဖြင့် ၇၂ ဘိုက်အတွင်း (မြန်မာအက္ခရာ ၂၄ လုံးခန့်) သာ ထည့်ပါ။",
  "signup.err.throttled":
    "ကြိုးစားမှု များလွန်းနေပါသည်။ နောက်မှ ထပ်ကြိုးစားပါ။",
  "signup.err.houseNumber": "မှန်ကန်သော အိမ်နံပါတ်ကို ရွေးပါ။",
  "signup.err.dob": "မွေးသက္ကရာဇ် မမှန်ကန်ပါ။ အနာဂတ်ရက် မဖြစ်ရပါ။",
  "signup.err.houseUnavailable": "ရွေးထားသော အိမ်ကို အသုံးပြု၍ မရပါ။",
  "signup.err.emailExists": "ဤအီးမေးလ်ဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.phoneExists": "ဤဖုန်းနံပါတ်ဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.accountExists": "ဤအချက်အလက်များဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.generic": "အကောင့် ဖွင့်၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "signup.noHousesTitle": "အိမ်များ မရှိသေးပါ",
  "signup.noHousesBody":
    "{village} တွင် အသုံးပြုနေသော အိမ်နံပါတ် မရှိသေးပါ။ ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "signup.backToCode": "ကျေးရွာကုဒ်သို့ ပြန်ရန်",

  // Settings (Feature Q additions)
  "settings.profileDesc": "သင့်အမည်နှင့် ဝင်ရောက်မည့် နည်းလမ်း။",
  "settings.passwordDesc":
    "စကားဝှက် ပြောင်းပြီးနောက် အကောင့်မှ ထွက်သွားမည် ဖြစ်သည်။",
  "settings.preferencesDesc":
    "အက်ပ်တစ်ခုလုံးတွင် အသုံးပြုမည့် ဘာသာစကားကို ရွေးပါ။",
  "settings.saved": "ဆက်တင်များ သိမ်းပြီးပါပြီ။",
  "settings.phonePlaceholder": "09xxxxxxx",
  "profile.dob": "မွေးသက္ကရာဇ်",
  "profile.optional": "မဖြည့်လည်းရ",
  "profile.dobHint":
    "ကျေးရွာ လူဦးရေ စာရင်းအင်းအတွက် အသုံးပြုသည်။ မဖြည့်ဘဲ ထားနိုင်သည်။",
  "profile.signInGroup": "ဝင်ရောက်မည့် နည်းလမ်း",
  "profile.signInIntro":
    "အီးမေးလ်၊ ဖုန်းနံပါတ် သို့မဟုတ် နှစ်မျိုးလုံး ထည့်ပါ။ အနည်းဆုံး တစ်မျိုး လိုအပ်ပါသည်။",
  "profile.saved": "ပရိုဖိုင် သိမ်းပြီးပါပြီ။",
  "password.showPasswords": "စကားဝှက်များ ပြရန်",
  "password.signedOut":
    "လုံခြုံရေးအတွက် အကောင့်မှ ထွက်သွားပါပြီ။ စကားဝှက်အသစ်ဖြင့် ပြန်လည် ဝင်ရောက်ပါ။",
  "password.signInAgain": "ပြန်လည် ဝင်ရောက်ရန်",

  // Membership rejoin
  "rejoin.title": "အိမ်ထောင်စုသို့ ပြန်လည်ဝင်ရောက်ရန်",
  "rejoin.subtitle":
    "{village} သို့ ပြန်လည်ဝင်ရောက်ရန် သင့်အိမ်ကို ရွေးပြီး တောင်းဆိုမှု အသစ် ပို့ပါ။",
  "rejoin.villageFallback": "ဤကျေးရွာ",
  "rejoin.statusRejectedTitle": "သင့်အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှုကို ပယ်ချခဲ့သည်",
  "rejoin.statusRemovedTitle": "သင့်ကို အိမ်ထောင်စုမှ ဖယ်ရှားထားသည်",
  "rejoin.statusBody":
    "{village} ကို ဆက်လက်အသုံးပြုရန် အောက်တွင် အိမ်ထောင်စု တောင်းဆိုမှု အသစ် ပို့ပါ။",
  "rejoin.village": "ကျေးရွာ",
  "rejoin.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "rejoin.formTitle": "အိမ်ထောင်စု တောင်းဆိုမှု အသစ်",
  "rejoin.formDesc": "ပြန်လည်ဝင်ရောက်လိုသော အိမ်ကို ရွေးပါ။",
  "rejoin.houseLabel": "အိမ်နံပါတ်",
  "rejoin.housePlaceholder": "အိမ်နံပါတ် ရွေးပါ",
  "rejoin.houseRequired": "ဆက်လက်ရန် အိမ်နံပါတ် ရွေးပါ။",
  "rejoin.nextTitle": "နောက်ဆက်တွဲ ဖြစ်မည့်အရာ",
  "rejoin.nextHasMembersTitle":
    "အိမ်တွင် လက်ရှိ အဖွဲ့ဝင်များ ရှိပြီးသား ဖြစ်လျှင်",
  "rejoin.nextHasMembersBody":
    "အိမ်ထောင်စုခေါင်းဆောင်က အတည်ပြုသည်အထိ သင့်တောင်းဆိုမှု စောင့်ဆိုင်းနေမည်။",
  "rejoin.nextEmptyTitle": "အိမ်တွင် လက်ရှိ အဖွဲ့ဝင် မရှိလျှင်",
  "rejoin.nextEmptyBody": "သင်သည် ချက်ချင်း အိမ်ထောင်စုခေါင်းဆောင် ဖြစ်လာမည်။",
  "rejoin.submit": "ပြန်လည်ဝင်ရောက်ရန် တောင်းဆိုမည်",
  "rejoin.submitting": "တောင်းဆိုမှု ပို့နေသည်...",
  "rejoin.noHousesTitle": "အသုံးပြုနေသော အိမ် မရှိသေးပါ",
  "rejoin.noHousesBody":
    "ဤကျေးရွာတွင် အသုံးပြုနေသော အိမ် မရှိသေးပါ။ ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "rejoin.signedInAs": "ဝင်ရောက်ထားသူ",

  // Forbidden page (Feature T)
  "forbidden.title": "ဝင်ရောက်ခွင့် မရှိပါ",
  "forbidden.body": "ဤစာမျက်နှာကို ကြည့်ရှုရန် သင့်တွင် ခွင့်ပြုချက် မရှိပါ။",
  "forbidden.hint":
    "ဤစာမျက်နှာသည် သင့်အကောင့်အတွက် မဟုတ်ပါက ဒက်ရှ်ဘုတ်သို့ ပြန်သွားပါ။ ဝင်ခွင့်ရှိသင့်သည်ဟု ယူဆပါက ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "forbidden.goHome": "ကျွန်ုပ်၏ ဒက်ရှ်ဘုတ်သို့ သွားရန်",

  // Platform admin dashboard (Feature D)
  "adminDashboard.title": "ပလက်ဖောင်း ဒက်ရှ်ဘုတ်",
  "adminDashboard.description":
    "စနစ်ရှိ ကျေးရွာအားလုံးကို အကျဉ်းချုပ် ကြည့်ရန်။",
  "adminDashboard.create": "ကျေးရွာ ဖန်တီးရန်",
  "adminDashboard.statusTitle": "အခြေအနေအလိုက် ကျေးရွာများ",
  "adminDashboard.totalVillages": "ကျေးရွာ စုစုပေါင်း",
  "adminDashboard.chartLabel":
    "ကျေးရွာ {total} ခု - လက်ရှိ {active} ခု၊ ယာယီရပ်ဆိုင်း {suspended} ခု၊ ပိတ်သိမ်း {deactivated} ခု",
  "adminDashboard.status.active": "လက်ရှိ အသုံးပြုနေသည်",
  "adminDashboard.status.suspended": "ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.status.deactivated": "ပိတ်သိမ်းထားသည်",
  "adminDashboard.suspendedOne": "ကျေးရွာ {count} ခု ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.suspendedOther": "ကျေးရွာ {count} ခု ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.review": "စစ်ဆေးရန်",
  "adminDashboard.recent": "မကြာသေးမီက ကျေးရွာများ",
  "adminDashboard.viewAll": "အားလုံး ကြည့်ရန်",
  "adminDashboard.created": "ဖန်တီးသည့်ရက် {date}",
  "adminDashboard.emptyTitle": "ကျေးရွာ မရှိသေးပါ",
  "adminDashboard.emptyBody": "စတင်ရန် ပထမဆုံး ကျေးရွာကို ဖန်တီးပါ။",

  // Village directory and management (Feature E)
  "adminVillages.title": "ကျေးရွာများ",
  "adminVillages.description":
    "ပလက်ဖောင်းရှိ ကျေးရွာအားလုံးကို ရှာဖွေ၊ စစ်ဆေးပြီး စီမံပါ။",
  "adminVillages.create": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.searchLabel": "ကျေးရွာ ရှာရန်",
  "adminVillages.searchPlaceholder": "ကုဒ် သို့မဟုတ် အမည်ဖြင့် ရှာပါ",
  "adminVillages.clearSearch": "ရှာဖွေမှု ဖျက်ရန်",
  "adminVillages.filterLabel": "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
  "adminVillages.filterAll": "အားလုံး",
  "adminVillages.resultCount": "ကျေးရွာ {total} ခုအနက် {shown} ခု ပြသနေသည်",
  "adminVillages.emptyTitle": "ကျေးရွာ မရှိသေးပါ",
  "adminVillages.emptyBody": "စတင်ရန် ပထမဆုံး ကျေးရွာကို ဖန်တီးပါ။",
  "adminVillages.noMatchTitle": "ကိုက်ညီသော ကျေးရွာ မတွေ့ပါ",
  "adminVillages.noMatchBody":
    "အခြား ရှာဖွေမှု သို့မဟုတ် အခြေအနေ စစ်ထုတ်မှုကို စမ်းကြည့်ပါ။",
  "adminVillages.clearFilters": "စစ်ထုတ်မှုများ ဖျက်ရန်",
  "adminVillages.back": "ကျေးရွာများသို့ ပြန်ရန်",
  "adminVillages.new.title": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.new.description":
    "ကျေးရွာအသစ်နှင့် ၎င်း၏ ပထမဆုံး အုပ်ချုပ်ရေးမှူး အကောင့်ကို ဖန်တီးပါ။",
  "adminVillages.form.villageTitle": "ကျေးရွာ အချက်အလက်",
  "adminVillages.form.villageDesc":
    "ကျေးရွာသားများသည် ဤကုဒ်ကို ထည့်သွင်း၍ ကျေးရွာသို့ ဝင်ရောက်ရပါမည်။",
  "adminVillages.form.code": "ကျေးရွာကုဒ်",
  "adminVillages.form.codePlaceholder": "ဥပမာ - DEV101",
  "adminVillages.form.codeHint": "တိုတောင်းပြီး တစ်ခုတည်းသာ ရှိရပါမည်။",
  "adminVillages.form.name": "ကျေးရွာအမည်",
  "adminVillages.form.namePlaceholder": "ဥပမာ - ဖွံ့ဖြိုးမှုကျေးရွာသစ်",
  "adminVillages.form.chiefTitle": "ပထမဆုံး အုပ်ချုပ်ရေးမှူး အကောင့်",
  "adminVillages.form.chiefDesc":
    "အုပ်ချုပ်ရေးမှူးသည် ဤကျေးရွာ၏ အိမ်များ၊ ရန်ပုံငွေများနှင့် ကောက်ခံသူများကို စီမံပါသည်။",
  "adminVillages.form.chiefName": "အုပ်ချုပ်ရေးမှူး အမည်",
  "adminVillages.form.chiefEmail": "အုပ်ချုပ်ရေးမှူး အီးမေးလ်",
  "adminVillages.form.chiefPhone": "အုပ်ချုပ်ရေးမှူး ဖုန်းနံပါတ်",
  "adminVillages.form.phonePlaceholder": "09xxxxxxx",
  "adminVillages.form.contactHint":
    "အုပ်ချုပ်ရေးမှူးသည် အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါမည်။",
  "adminVillages.form.password": "ယာယီ စကားဝှက်",
  "adminVillages.form.passwordHint":
    "အုပ်ချုပ်ရေးမှူးထံ လုံခြုံစွာ ပေးပို့ပါ။ ဝင်ရောက်ပြီးနောက် ပြောင်းလဲသင့်ပါသည်။",
  "adminVillages.form.submit": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.form.submitting": "ကျေးရွာ ဖန်တီးနေသည်...",
  "adminVillages.form.errorTitle": "ကျေးရွာ ဖန်တီး၍ မရပါ",
  "adminVillages.form.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "adminVillages.form.generic": "ကျေးရွာ ဖန်တီး၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "adminVillages.err.codeExists": "ဤကျေးရွာကုဒ် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.emailExists":
    "ဤအီးမေးလ်ဖြင့် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.phoneExists":
    "ဤဖုန်းနံပါတ်ဖြင့် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.exists":
    "ဤအချက်အလက်များဖြင့် ကျေးရွာ သို့မဟုတ် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.codeInvalid":
    "ကျေးရွာကုဒ်သည် အက္ခရာ သို့မဟုတ် ဂဏန်း 3 လုံးမှ 20 လုံးအတွင်း ဖြစ်ရမည်။",
  "adminVillages.err.nameLength":
    "ကျေးရွာအမည်သည် စာလုံး 2 လုံးမှ 100 အတွင်း ဖြစ်ရမည်။",
  "adminVillages.err.chiefNameLength":
    "အုပ်ချုပ်ရေးမှူး အမည�����������သည် စာလုံး 2 လုံးမှ 100 အတွင်း ဖြစ်ရမည်။",
  "adminVillages.err.emailInvalid": "အုပ်ချုပ်ရေးမှူး၏ အီးမေးလ် မမှန်ကန်ပါ။",
  "adminVillages.err.phoneInvalid":
    "���ုပ်ချုပ်ရေးမှူး၏ ဖုန်းနံပါတ် မမှန်ကန်ပါ။",
  "adminVillages.err.identifierRequired":
    "အုပ်ချုပ်ရေးမှူး ဝင်ရောက်ရန် အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ် အနည်းဆုံး တစ်ခု ထည့်ပါ။",
  "adminVillages.err.passwordLength":
    "စကားဝှက်သည် စာလုံး 8 လုံးမှ 72 အတွင်း ဖြစ်ရမည်။",
  "adminVillages.err.passwordBytes":
    "စကားဝှက် ရှည်လွန်းသည်။ 72 ဘိုက်ထက် မပိုရပါ။ မြန်မာအက္ခရာ တစ်လုံးလျှင် 3 ဘိုက် ယူသည်။",
  "adminVillages.err.retry": "စနစ် အလုပ်များနေသည်။ ခဏစောင့်ပြီး ထပ်ကြိုးစားပါ။",
  "adminVillages.err.reasonTooLong":
    "အကြောင်းပြချက်သည် စာလုံး 200 ထက် မပိုရပါ။ တိုအောင်ပြင်ပြီး ထပ်ကြိုးစားပါ။",
  "adminVillages.reason.label": "အကြောင်းပြချက် (မဖြည့်လည်းရသည်)",
  "adminVillages.reason.hint":
    "စာရင်းစစ် မှတ်တမ်းတွင် သိမ်းထားမည်ဖြစ်ပြီး ကျေးရွာက ကြည့်နိုင်သည်။ ကိုယ်ရေးကိုယ်တာ အချက်အလက် မထည့်ပါနှင့်။ စာလုံး 200 အထိ။",
  "adminVillages.detail.infoTitle": "ကျေးရွာ အချက်အလက်",
  "adminVillages.detail.code": "ကျေးရွာကုဒ်",
  "adminVillages.detail.name": "ကျေးရွာအမည်",
  "adminVillages.detail.status": "အခြေအနေ",
  "adminVillages.detail.createdAt": "ဖန်တီးသည့်ရက်",
  "adminVillages.detail.updatedAt": "နောက်ဆုံး ပြင်ဆင်သည့်ရက်",
  "adminVillages.detail.lifecycleTitle": "အခြေအနေနှင့် လုပ်ဆောင်ချက်များ",
  "adminVillages.statusDesc.active":
    "ဤကျေးရွာသည် လက်ရှိ ပုံမှန် အသုံးပြုနေဆဲ ဖြစ်သည်။",
  "adminVillages.statusDesc.suspended":
    "ဤကျေးရွာကို ယာယီ ရပ်ဆိုင်းထားသည်။ မည်သည့်အချိန်တွင်မဆို ပြန်ဖ: �င့်နိုင်သည်။",
  "adminVillages.statusDesc.deactivated":
    "ဤကျေးရွာကို ပိတ်သိမ်းထားသည်။ စီမံနိုင်သော လုပ်ဆောင်ချက် မရှိတော့ပါ။ ကျေးရွာ မှတ်တမ်းနှင့် သမိုင်းကြောင်း ဒေတာများကို ဆက်လက် သိမ်းဆည်းထားသည်။",
  "adminVillages.suspend.button": "ကျေးရွာ ယာယီ ရပ်ဆိုင်းရန်",
  "adminVillages.suspend.hint":
    "ဤကျေးရွာကို ယာယီ ရပ်ဆိုင်းပါ။ နောက်မှ ပြန်ဖွင့်နိုင်သည်။",
  "adminVillages.reactivate.button": "ကျေးရွာ ပြန်ဖွင့်ရန်",
  "adminVillages.reactivate.hint":
    "ဤကျေးရွာကို လက်ရှိ အသုံးပြုနေသော အခြေအနေသို့ ပြန်ထားပါ။",
  "adminVillages.deactivate.title": "ကျေးရွာ ပိတ်သိမ်းရန်",
  "adminVillages.deactivate.hint":
    "ပိတ်သိမ်းခြင်းသည် MVP တွင် နောက်ပြန်လှည့်၍ မရပါ။ ကျေးရွာ မှတ်တမ်းနှင့် သမိုင်းကြောင်း ဒေတာများကို သိမ်းထားသော်လည်း ကျေးရွာအသုံးပြုသူများ ဝင်ရောက်ခွင့် ဆုံးရှုံးမည်။",
  "adminVillages.deactivate.button": "ကျေးရွာ ပိတ်သိမ်းရန်",
  "adminVillages.deactivate.confirmTitle": "ဤကျေးရွာကို ပိတ်သိမ်းမလား။",
  "adminVillages.deactivate.confirmBody":
    "{name} ({code}) ကို ပိတ်သိမ်းပါမည်။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်လှည့်၍ မရပါ။ ကျေးရွာအသုံးပြုသူများ ဝင်ရောက်ခွင့် ဆုံးရှုံးမည်ဖြစ်ပြီး မှတ်တမ်းများကို ဆက်လက် သိမ်းထားမည်။ ကျေးရွာကုဒ်နှင့် အသုံးပြုသူများ၏ အီးမေးလ်၊ ဖုန်းနံပါတ်များကို ဆက်လက် သီးသန့်ထားမည်ဖြစ်သောကြောင့် ပြန်လည် အသုံးပြု၍ မရပါ။",
  "adminVillages.deactivate.confirm": "ဟုတ်ကဲ့၊ ပိတ်သိမ်းမည်",

  // Audit logs (Feature P)
  "audit.title": "စာရင်းစစ် မှတ်တမ်း",
  "audit.description":
    "သင့်ကျေးရွာတွင် ဆောင်ရွက်ခဲ့သော လုပ်ဆောင်ချက်များ၏ သမိုင်းကို ကြည့်ရှုပါ။ စာရင်းစစ် မှတ်တမ်းများကို ထပ်ဖြည့်၍သာ ရေးသွင်းနိုင်ပါသည်။",
  "audit.platform.title": "ပလက်ဖောင်း စာရင်းစစ်",
  "audit.platform.description":
    "ပလက်ဖောင်းတစ်လျှောက် ကျေးရွာ အခြေအနေ ပြောင်းလဲမှု ဖြစ်ရပ်များ။ ဤနေရာတွင် ကျေးရွာအဆင့် မှတ်တမ်းများကိုသာ ပြသထားသည်။",
  "audit.filters.title": "စစ်ထုတ်ရန်",
  "audit.filters.activeCount": "{count} ခု အသုံးပြုထားသည်",
  "audit.filters.action": "လုပ်ဆောင်ချက် အမျိုးအစား",
  "audit.filters.entity": "အရာဝတ္ထု အမျိုးအစား",
  "audit.filters.from": "စတင်သည့်ရက်",
  "audit.filters.to": "ပြီးဆုံးသည့်ရက်",
  "audit.filters.allActions": "လုပ်ဆောင်ချက် အားလုံး",
  "audit.filters.allEntities": "အမျိုးအစား အားလုံး",
  "audit.filters.apply": "စစ်ထုတ်မှု အသုံးပြုရန်",
  "audit.filters.applying": "အသုံးပြုနေသည်...",
  "audit.filters.reset": "ပြန်လည်သတ်မှတ်ရန်",
  "audit.filters.clear": "စစ်ထုတ်မှုများ ဖျက်ရန်",
  "audit.summary": "မှတ်တမ်း စုစုပေါင်း - {total} ခု",
  "audit.empty.title": "စာရင်းစစ် မှတ်တမ်း မရှိပါ",
  "audit.empty.body":
    "လက်ရှိ စစ်ထုတ်မှုနှင့် ကိုက်ညီသော စာရင်းစစ် မှတ်တမ်း မရှိပါ။",
  "audit.empty.noneBody": "စာရင်းစစ် မှတ်တမ်း မရှိသေးပါ။",
  "audit.platform.empty.title": "ပလက်ဖောင်း စာရင်းစစ် မှတ်တမ်း မရှိပါ",
  "audit.platform.empty.body":
    "လက်ရှိ စစ်ထုတ်မှုနှင့် ကိုက်ညီသော ကျေးရွာ ဖြစ်ရပ် မရှိပါ။",
  "audit.platform.empty.noneBody": "ကျေးရွာ ဖြစ်ရပ် မှတ်တမ်း မရှိသေးပါ။",
  "audit.by": "{name} က ဆောင်ရွက်သည်",
  "audit.system": "စနစ်",
  "audit.list.label": "စာရင်းစစ် ဖြစ်ရပ်များ",
  "audit.pagination.label": "စာမျက်နှာ ခွဲခြားမှု",
  "audit.pagination.previous": "ယခင်",
  "audit.pagination.next": "နောက်",
  "audit.pagination.pageOf": "စာမျက်နှာ {page} / {total}",
  "audit.detail.title": "စာရင်းစစ် အသေးစိတ်",
  "audit.detail.description":
    "စာရင်းစစ် မှတ်တမ်း တစ်ခု၏ မပြောင်းလဲနိုင်သော မှတ်တမ်း။",
  "audit.detail.back": "စာရင်းစစ် မှတ်တမ်းသို့ ပြန်ရန်",
  "audit.platform.detail.title": "ပလက်ဖောင်း စာရင်းစစ် အသေးစိတ်",
  "audit.platform.detail.description":
    "ကျေးရွာ အခြေအနေ ပြောင်းလဲမှု မှတ်တမ်း တစ်ခု။",
  "audit.platform.detail.back": "ပလက်ဖောင်း စာရင်းစစ်သို့ ပြန်ရန်",
  "audit.detail.eventTitle": "ဖြစ်ရပ် အချက်အလက်",
  "audit.detail.action": "လုပ်ဆောင်ချက်",
  "audit.detail.entityType": "အမျိုးအစား",
  "audit.detail.entity": "အရာဝတ္ထု",
  "audit.detail.actor": "ဆောင်ရွက်သူ",
  "audit.detail.timestamp": "အချိန်",
  "audit.detail.detailsTitle": "အသေးစိတ်",
  "audit.detail.noDetails": "နောက်ထပ် အသေးစိတ် မရှိပါ။",
  "audit.detail.appendOnly":
    "စာရင်းစစ် မှတ်တမ်းများကို ထပ်ဖြည့်၍သာ ရေးသွင်းနိုင်ပြီး ပြင်ဆင်ခြင်း သို့မဟုတ် ဖျက်ခြင်း မပြုနိုင်ပါ။",
  "audit.detail.statusChange": "အခြေအနေ ပြောင်းလဲမှု",
  "audit.action.create": "ဖန်တီးခြင်း",
  "audit.action.update": "ပြင်ဆင်ခြင်း",
  "audit.action.delete": "ဖျက်ခြင်း",
  "audit.action.statusChange": "အခြေအနေ ပြောင်းခြင်း",
  "audit.action.approve": "အတည်ပြုခြင်း",
  "audit.action.reject": "ပယ်ချခြင်း",
  "audit.action.remove": "ဖယ်ရှားခြင်း",
  "audit.action.assign": "တာဝန်ပေးခြင်း",
  "audit.action.void": "ပယ်ဖျက်ခြင်း",
  "audit.action.accept": "လက်ခံခြင်း",
  "audit.action.login": "ဝင်ရောက်ခြင်း",
  "audit.action.logout": "ထွက်ခွာခြင်း",
  "audit.action.loginThrottled": "ဝင်ရောက်မှု ကန့်သတ်ခြင်း",
  "audit.entity.village": "ကျေးရွာ",
  "audit.entity.house": "အိမ်",
  "audit.entity.user": "အသုံးပြုသူ",
  "audit.entity.fund": "ရန်ပုံငွေ",
  "audit.entity.collectorAssignment": "ကောက်ခံသူ တာဝန်ပေးမှု",
  "audit.entity.payment": "ငွေပေးချေမှု",
  "audit.entity.receipt": "ပြေစာ",
  "audit.entity.dispute": "အငြင်းပွားမှု",
  "audit.entity.session": "စက်ရှင်",
  "audit.meta.villageCode": "ကျေးရွာကုဒ်",
  "audit.meta.name": "အမည်",
  "audit.meta.previousStatus": "ယခင် အခြေအနေ",
  "audit.meta.newStatus": "အခြေအနေ အသစ်",
  "audit.value.yes": "ဟုတ်ကဲ့",
  "audit.value.no": "မဟုတ်ပါ",

  // Village dashboard (Feature F)
  "dashboard.title": "ကျေးရွာ ဒက်ရှ်ဘုတ်",
  "dashboard.welcome": "ပြန်လည်ကြိုဆိုပါသည်၊ {name}။",
  "dashboard.pending.welcome": "ကျေးရွာမှ ကြိုဆိုပါသည်။",
  "dashboard.pending.title": "အိမ်ထောင်စု အတည်ပြုချက် စောင့်ဆိုင်းနေသည်",
  "dashboard.pending.body":
    "သင့်အဖွဲ့ဝင်ခွင့်သည် အိမ်ထောင်စုခေါင်းဆောင်၏ အတည်ပြုချက်ကို စောင့်ဆိုင်းနေသည်။ အတည်ပြုပြီးနောက် ငွေကြေးနှင့် အိမ်ထောင်စု လုပ်ဆောင်ချက်များကို အသုံးပြုနိုင်မည်။",
  "dashboard.chief.title": "ကျေးရွာ အနှစ်ချုပ်",
  "dashboard.stat.houses": "အိမ် စုစုပေါင်း",
  "dashboard.stat.members": "လက်ရှိ အဖွဲ့ဝင်များ",
  "dashboard.stat.pendingPayments": "စောင့်ဆိုင်းနေသော ငွေပေးချေမှုများ",
  "dashboard.stat.openDisputes": "ဖွင့်ထားသော အငြင်းပွားမှုများ",
  "dashboard.stat.currentCollector": "လက်ရှိ ကောက်ခံသူ",
  "dashboard.unassigned": "တာဝန်မပေးရသေးပါ",
  "dashboard.fund.title": "လက်ရှိ ရန်ပုံငွေ",
  "dashboard.fund.viewDetail": "အသေးစိတ် ကြည့်ရန်",
  "dashboard.fund.target": "အိမ်တစ်အိမ်လျှင် ပစ်မှတ်",
  "dashboard.fund.targetAmount": "ပစ်မှတ် ငွေပမာဏ",
  "dashboard.fund.collected": "ကောက်ခံပြီး",
  "dashboard.fund.period": "ကာလ",
  "dashboard.fund.dateRange": "{start} မှ {end} အထိ",
  "dashboard.fund.paymentStatus": "ငွေပေးချေမှု အခြေအနေ",
  "dashboard.fund.noneTitle": "အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ",
  "dashboard.fund.noneChief":
    "အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ။ ငွေကောက်ခံရန် ရန်ပုံငွေ တစ်ခုကို ဖန်တီးပြီး စတင်ပါ။",
  "dashboard.fund.noneVillager":
    "သင့်ကျေးရွာတွင် ယခုအချိန် အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ။",
  "dashboard.fund.goFunds": "ရန်ပုံငွေများသို့ သွားရန်",
  "dashboard.pay.notPaid": "မပေးရသေးပါ",
  "dashboard.pay.cashInfo":
    "ငွေသားပေးချေမှုများကို ကျေးရွာကောက်ခံသူက မှတ်တမ်းတင်ပေးသည်။ သင့်ပေးချေမှုကို မှတ်တမ်းတင်ရန် ၎င်းတို့ကို မေးမြန်းပါ။",
  "dashboard.status.accepted": "လက်ခံပြီး",
  "dashboard.status.pending": "စောင့်ဆိုင်းဆဲ",
  "dashboard.status.rejected": "ပယ်ချခံရသည်",
  "dashboard.method.kpay": "KPay",
  "dashboard.method.cash": "ငွေသား",
  "dashboard.recent.title": "မကြာသေးမီက ငွေပေးချေမှုများ",
  "dashboard.recent.viewReceipts": "ပြေစာများ ကြည့်ရန် ({count})",
  "dashboard.recent.empty": "ငွေပေးချေမှု မှတ်တမ်း မရှိသေးပါ။",
  "dashboard.rejected.one":
    "ယခင် ပယ်ချထားသော ငွေပေးချေမှု {count} ခု ရှိသည်။",
  "dashboard.rejected.other":
    "ယခင် ပယ်ချထားသော ငွေပေးချေမှု {count} ခု ရှိသည်။",
  "dashboard.collector.title": "ကောက်ခံသူ အနှစ်ချုပ်",
  "dashboard.collector.period": "ကာလ - {period}",
  "dashboard.collector.accepted": "လက်ခံပြီး",
  "dashboard.collector.rejected": "ပယ်ချပြီး",
  "dashboard.collector.cash": "မှတ်တမ်းတင်ပြီး ငွေသား",
  "dashboard.collector.record": "ငွေသား မှတ်တမ်းတင်ရန်",
  "dashboard.collector.summaryTitle": "ကောက်ခံမှု အနှစ်ချုပ်",
  "dashboard.collector.totalCollected": "ကောက်ခံငွေ စုစုပေါင်း",
  "dashboard.collector.pendingAmount": "စောင့်ဆိုင်းနေသော ငွေပမာဏ",
  "dashboard.collector.completed": "ပြီးစီးသော ကောက်ခံမှုများ",
  "dashboard.collector.pendingCollections": "စောင့်ဆိုင်းနေသော ကောက်ခံမှုများ",
  "dashboard.charts.trendTitle": "အချိန်အလိုက် ကောက်ခံမှု",
  "dashboard.charts.trendDesc": "လအလိုက် လက်ခံပြီး ကောက်ခံငွေ ပမာဏများ။",
  "dashboard.charts.paidPendingTitle": "ပေးပြီး နှင့် စောင့်ဆိုင်းဆဲ",
  "dashboard.charts.paidPendingDesc":
    "သင်လက်ခံသော ငွေပေးချေမှုများနှင့် ကျေးရွာတစ်ခုလုံး၏ စောင့်ဆိုင်းနေသော ငွေပေးချေမှုများ။",
  "dashboard.chart.collected": "ကောက်ခံပြီး",
  "dashboard.chart.month": "လ",
  "dashboard.chart.paid": "ပေးပြီး",
  "dashboard.chart.pending": "စောင့်ဆိုင်းဆဲ",
  "dashboard.chart.paymentsCount": "ငွေပေးချေမှု {count} ခု",
  "dashboard.chart.emptyCollection": "ကောက်ခံမှု ဒေတာ မရှိသေးပါ။",
  "dashboard.chart.emptyPayments": "ငွေပေးချေမှု ဒေတာ မရှိသေးပါ။",
  "dashboard.chart.emptyMembers": "အဖွဲ့ဝင် ဒေတာ မရှိပါ။",
  "dashboard.demo.title": "ကျေးရွာ လူဦးရေ ဖွဲ့စည်းမှု",
  "dashboard.demo.desc":
    "လက်ရှိ အဖွဲ့ဝင်များ၏ အသက်အုပ်စု ခွဲခြမ်းမှု။ မွေးသက္ကရာဇ် မရှိသူများကို “မသတ်မှတ်ရသေးပါ” အဖြစ် ပြသထားသည်။",
  "dashboard.demo.total": "လက်ရှိ အဖွဲ့ဝင် စုစုပေါင်း - {count} ဦး",
  "dashboard.age.children": "ကလေးများ (၀–၁၂)",
  "dashboard.age.teenagers": "ဆယ်ကျော်သက်များ (၁၃–၁၇)",
  "dashboard.age.adults": "လူကြီးများ (၁၈–၅၉)",
  "dashboard.age.elderly": "သက်ကြီးရွယ်အိုများ (၆၀+)",
  "dashboard.age.notSet": "မသတ်မှတ်ရသေးပါ",
  "dashboard.search.title": "ငွေပေးချေမှု အခြေအနေ ရှာရန်",
  "dashboard.search.desc":
    "လက်ရှိ ရန်ပုံငွေအတွက် အိမ်တစ်အိမ် ပေးချေပြီး ရှိမရှိ စစ်ဆေးပါ။",
  "dashboard.search.label": "အိမ်နံပါတ် သို့မဟုတ် အိမ်ထောင်စုခေါင်းဆောင် အမည်",
  "dashboard.search.placeholder":
    "အိမ်နံပါတ် သို့မဟုတ် အိမ်ထောင်စုခေါင်းဆောင် အမည်",
  "dashboard.search.submit": "ရှာရန်",
  "dashboard.search.searching": "ရှာဖွေနေသည်...",
  "dashboard.search.noMatchTitle": "ကိုက်ညီမှု မတွေ့ပါ",
  "dashboard.search.noMatchBody":
    "သင်ရှာဖွေသည့်အတိုင်း ကိုက်ညီသော အိမ် မတွေ့ပါ။",
  "dashboard.search.results": "ရလဒ် {count} ခု",
  "dashboard.search.house": "အိမ်နံပါတ် {number}",
  "dashboard.search.noHead": "အိမ်ထောင်စုခေါင်းဆောင် မရှိပါ",
  "dashboard.search.paid": "ပေးပြီး",
  "dashboard.search.notPaid": "မပေးရသေးပါ",

  // Household and membership (Feature G)
  "household.title": "အိမ်ထောင်စု အဖွဲ့ဝင်များ",
  "household.description": "အိမ်နံပါတ် {number} ၏ အဖွဲ့ဝင်များကို စီမံပါ။",
  "household.stat.head": "အိမ်ထောင်စုခေါင်းဆောင်",
  "household.stat.noHead": "မသတ်မှတ်ရသေးပါ",
  "household.stat.active": "လက်ရှိ အဖွဲ့ဝင်များ",
  "household.stat.pending": "စောင့်ဆိုင်းနေသော တောင်းဆိုမှုများ",
  "household.headBadge": "အိမ်ထောင်စုခေါင်းဆောင်",
  "household.pending.title": "စောင့်ဆိုင်းနေသော တောင်းဆိုမှုများ",
  "household.pending.desc":
    "ဤအိမ်သို့ ဝင်ရောက်ရန် တောင်းဆိုထားသူများ။ တောင်းဆိုမှုတစ်ခုချင်းကို အတည်ပြုပါ သို့မဟုတ် ပယ်ချပါ။",
  "household.pending.emptyTitle": "စောင့်ဆိုင်းနေသော တောင်းဆိုမှု မရှိပါ",
  "household.pending.emptyBody":
    "ဤအိမ်အတွက် စောင့်ဆိုင်းနေသော အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှု မရှိပါ။",
  "household.approve": "အတည်ပြုရန်",
  "household.reject": "ပယ်ချရန်",
  "household.reject.confirmBody":
    "{name} ၏ တောင်းဆိုမှုကို ပယ်ချပါမည်။ ပြန်လည်ဝင်ရောက်လိုပါက တောင်းဆိုမှု အသစ် ပို့ရပါမည်။",
  "household.reject.confirm": "ဟုတ်ကဲ့၊ ပယ်ချမည်",
  "household.active.title": "လက်ရှိ အဖွဲ့ဝင်များ",
  "household.active.desc": "ယခုအချိန်တွင် ဤအိမ်နှင့် သက်ဆိုင်သူများ။",
  "household.active.emptyTitle": "လက်ရှိ အဖွဲ့ဝင် မရှိပါ",
  "household.active.emptyBody": "ဤအိမ်တွင် လက်ရှိ အဖွဲ့ဝင် မရှိပါ။",
  "household.headNote":
    "အိမ်ထောင်စုခေါင်းဆောင်ကို တိုက်ရိုက် ဖယ်ရှား၍ မရပါ။ ခေါင်းဆောင်တာဝန်ကို အရင် လွှဲပြောင်းပါ။",
  "household.remove": "အဖွဲ့ဝင် ဖယ်ရှားရန်",
  "household.remove.confirmBody":
    "{name} ကို ဤအိမ်မှ ဖယ်ရှားပါမည်။ ပြန်လည်ဝင်ရောက်လိုပါက တောင်းဆိုမှု အသစ် ပို့ရပါမည်။",
  "household.remove.confirm": "ဟုတ်ကဲ့၊ ဖယ်ရှားမည်",
  "household.changeHead.title": "အိမ်ထောင်စုခေါင်းဆောင် ပြောင်းရန်",
  "household.changeHead.desc":
    "ခေါင်းဆောင်တာဝန်ကို အခြား လက်ရှိ အဖွဲ့ဝင်တစ်ဦးထံ လွှဲပြောင်းပါ။",
  "household.changeHead.label": "အိမ်ထောင်စုခေါင်းဆောင် အသစ်",
  "household.changeHead.placeholder": "လက်ရှိ အဖွဲ့ဝင်တစ်ဦးကို ရွေးပါ",
  "household.changeHead.submit": "အိမ်ထောင်စုခေါင်းဆောင် ပြောင်းရန်",
  "household.changeHead.note":
    "ချက်ချင်း အကျိုးသက်ရောက်မည်။ သင်သည် လက်ရှိ အဖွဲ့ဝင်အဖြစ် ဆက်ရှိနေမည်ဖြစ်သော်လည်း အိမ်ထောင်စု အဖွဲ့ဝင်များကို စီမံ၍ မရတော့ပါ။",
  "household.changeHead.emptyTitle": "ရွေးချယ်ခွင့်ရှိသူ မရှိပါ",
  "household.changeHead.emptyBody":
    "လက်ရှိ ခေါင်းဆောင် မဟုတ်သော လက်ရှိ အဖွဲ့ဝင်များသာ အိမ်ထောင်စုခေါင်းဆောင် အသစ် ဖြစ်နိုင်သည်။",
  "household.history.title": "ယခင် တောင်းဆိုမှုများနှင့် ဖယ်ရှားမှုများ",
  "household.history.emptyTitle": "သမိုင်းကြောင်း မှတ်တမ်း မရှိပါ",
  "household.history.emptyBody":
    "ဤအိမ်တွင် ပယ်ချခံရသူ သို့မဟုတ် ဖယ်ရှားခံရသူ မရှိပါ။",
  "household.history.note":
    "ပယ်ချခံရသူနှင့် ဖယ်ရှားခံရသူများကို မှတ်တမ်းတွင် ဆက်ထားပြီး လက်ရှိ အဖွဲ့ဝင်အဖြစ် ပြန်ပြောင်း၍ မရပါ။ ပြန်လည်ဝင်ရောက်လိုပါက တောင်းဆိုမှု အသစ် ပို့ရပါမည်။",

  // House management (Feature H)
  "houses.back": "အိမ်များသို့ ပြန်ရန်",
  "houses.list.title": "အိမ်များ",
  "houses.list.description": "သင့်ကျေးရွာရှိ တရားဝင် အိမ်နံပါတ်များကို စီမံပါ။",
  "houses.list.create": "အိမ် ဖန်တီးရန်",
  "houses.list.searchLabel": "အိမ် ရှာရန်",
  "houses.list.searchPlaceholder": "အိမ်နံပါတ် ရှာပါ",
  "houses.list.clearSearch": "ရှာဖွေမှု ဖျက်ရန်",
  "houses.list.filterLabel": "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
  "houses.list.resultCount": "အိမ် {total} လုံးအနက် {shown} လုံး ပြသနေသည်",
  "houses.list.emptyTitle": "အိမ် မရှိသေးပါ",
  "houses.list.emptyBody":
    "အိမ် မဖန်တီးရသေးပါ။ ကျေးရွာသားများ စာရင်းသွင်းရန် အိမ်နံပါတ် လိုအပ်ပါသည်။",
  "houses.list.emptyAction": "ပထမဆုံး အိမ် ဖန်တီးရန်",
  "houses.list.noMatchTitle": "ကိုက်ညီသော အိမ် မတွေ့ပါ",
  "houses.list.noMatchBody":
    "အခြား အိမ်နံပါတ် သို့မဟုတ် အခြေအနေ စစ်ထုတ်မှုကို စမ်းကြည့်ပါ။",
  "houses.list.clearFilters": "စစ်ထုတ်မှုများ ဖျက်ရန်",
  "houses.filter.all": "အားလုံး",
  "houses.filter.active": "လက်ရှိ အသုံးပြုနေသည်",
  "houses.filter.inactive": "ပိတ်ထားသည်",
  "houses.status.active": "လက်ရှိ အသုံးပြုနေသည်",
  "houses.status.inactive": "ပိတ်ထားသည်",
  "houses.detail.title": "အိမ်နံပါတ် {number}",
  "houses.detail.description": "တရားဝင် အိမ်နံပါတ် အသေးစိတ်။",
  "houses.detail.members": "လက်ရှိ/စောင့်ဆိုင်းဆဲ အဖွဲ့ဝင်များ",
  "houses.detail.payments": "ငွေပေးချေမှု မှတ်တမ်းများ",
  "houses.detail.infoTitle": "အိမ် အချက်အလက်",
  "houses.detail.head": "အိမ်ထောင်စုခေါင်းဆောင်",
  "houses.detail.noHead": "မသတ်မှတ်ရသေးပါ",
  "houses.detail.created": "ဖန်တီးသည့်ရက်",
  "houses.detail.updated": "နောက်ဆုံး ပြင်ဆင်သည့်ရက်",
  "houses.detail.actionsTitle": "လုပ်ဆောင်ချက်များ",
  "houses.detail.lifecycleTitle": "အိမ် အခြေအနေ",
  "houses.edit.button": "အိမ်နံပါတ် ပြင်ဆင်ရန်",
  "houses.edit.hint": "ဤအိမ်၏ တရားဝင် နံပါတ်ကို ပြောင်းလဲပါ။",
  "houses.edit.blockedPayments":
    "ဤအိမ်တွင် ငွေပေးချေမှု မှတ်တမ်းများ ရှိသောကြောင့် အိမ်နံပါတ်ကို ပြင်ဆင်၍ မရပါ။",
  "houses.deactivate.button": "အိမ် ပိတ်ရန်",
  "houses.deactivate.hint":
    "အိမ်ကို ပိတ်ထားပါက အဖွဲ့ဝင်အသစ်များ ဝင်ရောက်၍ မရတော့ပါ။",
  "houses.deactivate.confirmTitle": "ဤအိမ်ကို ပိတ်မလား။",
  "houses.deactivate.confirmBody":
    "အိမ်နံပါတ် {number} သည် အဖွဲ့ဝင်အသစ်များကို လက်မခံတော့ပါ။ နောက်မှ ပြန်ဖွင့်နိုင်သည်။",
  "houses.deactivate.confirm": "ဟုတ်ကဲ့၊ ပိတ်မည်",
  "houses.deactivate.blockedMembers":
    "လက်ရှိ သို့မဟုတ် စောင့်ဆိုင်းဆဲ အဖွဲ့ဝင်များ ရှိသော အိမ်ကို ပိတ်၍ မရပါ။",
  "houses.deactivate.blockedPayments":
    "ငွေပေးချေမှု မှတ်တမ်းများ ရှိသော အိမ်ကို ပိတ်၍ မရပါ။",
  "houses.reactivate.button": "အိမ် ပြန်ဖွင့်ရန်",
  "houses.reactivate.hint":
    "ပြန်ဖွင့်ပါက ဤအိမ်သို့ အဖွဲ့ဝင်အသစ်များ ပြန်လည် ဝင်ရ���ာ���်���ိုင်သည်။",
  "houses.form.houseNumber": "အိမ်နံပါတ်",
  "houses.form.hint":
    "စာလုံး၊ ဂဏန်း၊ နေရာလွတ်၊ တုံးတို၊ ဆလက်ရှ်၊ အစက်နှင့် ကွင်းစကွင်းပိတ်များ ထည့်နိုင်သည် (၂ လုံးမှ ၃၀ လုံး)။",
  "houses.create.title": "အိမ် ဖန်တီးရန်",
  "houses.create.description":
    "သင့်ကျေးရွာအတွက် တရားဝင် အိမ်နံပါတ် အသစ် ထည့်ပါ။",
  "houses.create.cardTitle": "အိမ် အချက်အလက်",
  "houses.create.placeholder": "ဥပမာ - A-12 သို့မဟုတ် 101",
  "houses.create.submit": "အိမ် ဖန်တီးရန်",
  "houses.create.submitting": "အိမ် ဖန်တီးနေသည်...",
  "houses.create.errorTitle": "အိမ် ဖန်တီး၍ မရပါ",
  "houses.create.generic": "အိမ် ဖန်တီး၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "houses.editPage.title": "အိမ်နံပါတ် ပြင်ဆင်ရန်",
  "houses.editPage.description": "တရားဝင် အိမ်နံပါတ်ကို ပြင်ဆင်ပါ။",
  "houses.editPage.current": "လက်ရှိ အိမ်နံပါတ် - {number}",
  "houses.editPage.submit": "ပြောင်းလဲမှုများ သိမ်းရန်",
  "houses.editPage.submitting": "သိမ်းဆည်းနေသည်...",
  "houses.editPage.errorTitle": "အိမ်နံပါတ် ပြင်ဆင်၍ မရပါ",
  "houses.editPage.generic": "အိမ်နံပါတ် ပြင်ဆင်၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "houses.editPage.stale":
    "အိမ်နံပါတ်ကို ပြင်ဆင်၍ မရပါ။ အိမ်သည် ပြောင်းလဲသွားနိုင်သည် သို့မဟုတ် မရှိတော့ပါ။ ကျေးဇူးပြု၍ စာမျက်နှာကို ပြန်ဖွင့်ပြီး ထပ်ကြိုးစားပါ။",

  // Collector assignments (Feature J)
  "collectors.title": "ကောက်ခံသူ တာဝန်ပေးမှုများ",
  "collectors.description":
    "လတစ်လချင်းစီအတွက် ကျေးရွာသားတစ်ဦးကို ကောက်ခံသူအဖြစ် တာဝန်ပေးပါ။",
  "collectors.current.title": "လက်ရှိ ကာလ",
  "collectors.current.activeCollector": "လက်ရှိ ကောက်ခံသူ",
  "collectors.current.assignNow": "ကောက်ခံသူ တာဝန်ပေးရန်",
  "collectors.period.upcoming": "လာမည့် ကာလ",
  "collectors.status.active": "လက်ရှိ အသုံးပြုနေသည်",
  "collectors.status.inactive": "ပိတ်ထားသည်",
  "collectors.form.title": "ကောက်ခံသူ တာဝန်ပေးရန်",
  "collectors.form.description": "ကောက်ခံမည့်သူနှင့် ကောက်ခံမည့် လကို ရွေးပါ။",
  "collectors.form.member": "ကျေးရွာသား",
  "collectors.form.memberPlaceholder": "ကျေးရွာသား ရွေးပါ",
  "collectors.status.ended": "ပြီးဆုံး",
  "collectors.form.memberHint":
    "လက်ရှိ အဖွဲ့ဝင်ဖြစ်သော ကျေးရွာသားများကိုသာ ပြထားသည်။",
  "collectors.form.year": "နှစ်",
  "collectors.form.month": "လ",
  "collectors.form.monthHint": "ကျော်လွန်သွားသော လများကို ရွေး၍ မရပါ။",
  "collectors.form.submit": "ကောက်ခံသူ တာဝန်ပေးမည်",
  "collectors.form.submitting": "တာဝန်ပေးနေသည်...",
  "collectors.form.errorTitle": "ကောက်ခံသူ တာဝန်ပေး၍ မရပါ",
  "collectors.form.generic": "ကောက်ခံသူ တာဝန်ပေး၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "collectors.form.success": "ကောက်ခံသူ တာဝန်ပေးပြီးပါပြီ။",
  "collectors.form.noMembersTitle": "တာဝန်ပေးနိုင်သော အဖွဲ့ဝင် မရှိပါ",
  "collectors.form.noMembersBody":
    "ကောက်ခံသူသည် လက်ရှိ အဖွဲ့ဝင် ကျေးရွာသား ဖြစ်ရပါမည်။",
  "collectors.history.title": "တာဝန်ပေးမှု မှတ်တမ်း",
  "collectors.history.description":
    "ကောက်ခံသူ တာဝန်ပေးမှုအားလုံး၊ နောက်ဆုံးကာလကို ရှေ့ဆုံးတွင် ပြထားသည်။",
  "collectors.history.emptyTitle": "တာဝန်ပေးမှု မရှိပါ",
  "collectors.history.emptyBody": "ကောက်ခံသူ တာဝန်ပေးမှု မဖန်တီးရသေးပါ။",
  "collectors.history.assigned": "တာဝန်ပေးသည့်ရက် {date}",
  "collectors.deactivate.button": "ပိတ်ရန်",
  "collectors.deactivate.confirmTitle": "ဤတာဝန်ပေးမှုကို ပိတ်မလား။",
  "collectors.deactivate.confirmBody":
    "{name} သည် {period} အတွက် လက်ရှိ ကောက်ခံသူ မဟုတ်တော့ပါ။",
  "collectors.deactivate.confirm": "ဟုတ်ကဲ့၊ ပိတ်မည်",
  "collectors.deactivate.working": "ပိတ်နေသည်...",
  "collectors.month.1": "ဇန်နဝါရီ",
  "collectors.month.2": "ဖေဖော်ဝါရီ",
  "collectors.month.3": "မတ်",
  "collectors.month.4": "ဧပြီ",
  "collectors.month.5": "မေ",
  "collectors.month.6": "ဇွန်",
  "collectors.month.7": "ဇူလိုင်",
  "collectors.month.8": "ဩဂုတ်",
  "collectors.month.9": "စက်တင်ဘာ",
  "collectors.month.10": "အောက်တိုဘာ",
  "collectors.month.11": "နိုဝင်ဘာ",
  "collectors.month.12": "ဒီဇင်ဘာ",

  // Fund management (Feature I)
  "funds.back": "ရန်ပုံငွေများသို့ ပြန်ရန်",
  "funds.backToFund": "ရန်ပုံငွေသို့ ပြန်ရန်",
  "funds.period": "{start} မှ {end} အထိ",
  "funds.status.draft": "မူကြမ်း",
  "funds.status.active": "အသုံးပြုနေသည်",
  "funds.status.closed": "ပိတ်ပြီး",
  "funds.progress.label": "ကောက်ခံမှု တိုးတက်မှု",
  "funds.filter.all": "အားလုံး",

  "funds.list.title": "ရန်ပုံငွေများ",
  "funds.list.description":
    "သင့်ကျေးရွာ ကောက်ခံမည့် ရန်ပုံငွေများကို ဖန်တီး၊ စတင်၊ ပိတ်သိမ်းပါ။",
  "funds.list.create": "ရန်ပုံငွေ ဖန်တီးရန်",
  "funds.list.filterLabel": "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
  "funds.list.countOne": "ရန်ပုံငွေ {count} ခု",
  "funds.list.countOther": "ရန်ပုံငွေ {count} ခု",
  "funds.list.emptyTitle": "ရန်ပုံငွေ မရှိသေးပါ",
  "funds.list.emptyBody": "ကျေးရွာမှ ငွေကောက်ခံရန် ရန်ပုံငွေတစ်ခု ဖန်တီးပါ။",
  "funds.list.emptyAction": "ပထမဆုံး ရန်ပုံငွေ ဖန်တီးရန်",
  "funds.list.noMatchTitle": "ကိုက်ညီသော ရန်ပုံငွေ မတွေ့ပါ",
  "funds.list.noMatchBody": "ဤအခြေအနေရှိ ရန်ပုံငွေ မရှိပါ။",
  "funds.list.showAll": "ရန်ပုံငွေ အားလုံး ပြရန်",
  "funds.card.collected": "ကောက်ခံပြီး",
  "funds.card.target": "ပစ်မှတ်",
  "funds.card.progress": "ပစ်မှတ်၏ {percent}%",

  "funds.summary.title": "ကောက်ခံမှု အနှစ်ချုပ်",
  "funds.summary.collected": "ကောက်ခံပြီး",
  "funds.summary.ofTarget": "ပစ်မှတ် {target} အနက်",
  "funds.summary.remaining": "ကျန်ရှိ",
  "funds.summary.accepted": "လက်ခံပြီး ငွေပေးချေမှုများ",
  "funds.summary.reached": "ပစ်မှတ် ပြည့်မီပြီ",
  "funds.summary.note":
    "ကောက်ခံပြီး ပမာဏတွင် လက်ခံပြီး ငွေပေးချေမှုများကိုသာ ထည့်သွင်းထားသည်။",

  "funds.info.title": "ရန်ပုံငွေ အချက်အလက်",
  "funds.info.start": "စတင်သည့်ရက်",
  "funds.info.end": "ပြီးဆုံးသည့်ရက်",
  "funds.info.created": "ဖန်တီးသည့်ရက်",
  "funds.info.updated": "နောက်ဆုံး ပြင်ဆင်သည့်ရက်",
  "funds.info.description": "ဖော်ပြချက်",
  "funds.info.noDescription": "ဖော်ပြချက် မရှိပါ။",

  "funds.lifecycle.title": "အခြေအနေနှင့် လုပ်ဆောင်ချက်များ",
  "funds.lifecycle.closedNote":
    "ဤရန်ပုံငွေကို ပိတ်ပြီးဖြစ်သည်။ ဆက်လက်လုပ်ဆောင်စရာ မရှိတော့ပါ။ ငွေပေးချေမှု မှတ်တမ်းများကို ဆက်လက် သိမ်းထားသည်။",
  "funds.lifecycle.edit": "ရန်ပုံငွေ ပြင်ဆင်ရန်",
  "funds.lifecycle.editHint": "မူကြမ်း ရန်ပုံငွေများကိုသာ ပြင်ဆင်နိုင်သည်။",
  "funds.lifecycle.activate": "ရန်ပုံငွေ စတင်ရန်",
  "funds.lifecycle.activateHint":
    "ကျေးရွာတစ်ခုတွင် ရန်ပုံငွေ တစ်ခုသာ အသုံးပြုနေနိုင်သည်။ စတင်ပြီးသော ရန်ပုံငွေကို ပြင်ဆင်၍ မရတော့ပါ။",
  "funds.lifecycle.activateBlockedTitle": "အခြား ရန်ပုံငွေ အသုံးပြုနေပြီ",
  "funds.lifecycle.activateBlockedBody":
    "ဤရန်ပုံငွေကို မစတင်မီ လက်ရှိ ရန်ပုံငွေကို ပိတ်ပါ။",
  "funds.lifecycle.activateConfirmTitle": "ဤရန်ပုံငွေကို စတင်မလား။",
  "funds.lifecycle.activateConfirmBody":
    "စတင်ပြီးနောက် ငွေကောက်ခံနိုင်မည်။ နောက်ပိုင်း ပြင်ဆင်၍ မရတော့ပါ။",
  "funds.lifecycle.activateConfirm": "ဟုတ်ကဲ့၊ စတင်မည်",
  "funds.lifecycle.close": "ရန်ပုံငွေ ပိတ်ရန်",
  "funds.lifecycle.closeHint":
    "ပိတ်ခြင်းဖြင့် ရန်ပုံငွေနှင့် ငွေပေးချေမှု မှတ်တမ်းများကို ဆက်လက် သိမ်းထားသည်။",
  "funds.lifecycle.closeConfirmTitle": "ဤရန်ပုံငွေကို ပိတ်မလား။",
  "funds.lifecycle.closeConfirmBody":
    "ပိတ်ခြင်းဖြင့် ရန်ပုံငွေနှင့် ငွေပေးချေမှု မှတ်တမ်းများကို ဆက်လက် သိမ်းထားသော်လည်း ပိတ်ပြီးသော ရန်ပုံငွေကို ပြန်ဖွင့်၍ မရပါ။",
  "funds.lifecycle.closeConfirm": "ဟုတ်ကဲ့၊ ပိတ်မည်",

  "funds.form.sectionDetails": "ရန်ပုံငွေ အချက်အလက်",
  "funds.form.sectionTarget": "ပစ်မှတ်နှင့် ကောက်ခံမည့် ကာလ",
  "funds.form.name": "ရန်ပုံငွေ အမည်",
  "funds.form.namePlaceholder": "ဥပမာ - ရေအရင်းအမြစ် ရန်ပုံငွေ",
  "funds.form.nameHint": "အက္ခရာ ၂ လုံးမှ ၁၀၀ လုံးအတွင်း။",
  "funds.form.description": "ဖော်ပြချက်",
  "funds.form.descriptionHint": "မဖြည့်လည်းရ။ အက္ခရာ ၅၀၀ လုံးအထိ။",
  "funds.form.targetAmount": "ပစ်မှတ် ငွေပမာဏ (ကျေးရွာတစ်ခုလုံး)",
  "funds.form.targetHint": "ကိန်းပြည့်သာ ထည့်ပါ။",
  "funds.form.startDate": "စတင်သည့်ရက်",
  "funds.form.endDate": "ပြီးဆုံးသည့်ရက်",
  "funds.form.periodHint":
    "ပြီးဆုံးသည့်ရက်သည် စတင်သည့်ရက်နှင့် တူညီရမည် သို့မဟုတ် နောက်ကျရမည်။",
  "funds.form.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "funds.create.title": "ရန်ပုံငွေ ဖန်တီးရန်",
  "funds.create.description":
    "သင့်ကျေးရွာအတွက် မူကြမ်း ရန်ပုံငွေ အသစ်တစ်ခု ဖန်တီးပါ။ မစတင်မချင်း ပြင်ဆင်နိုင်သည်။",
  "funds.create.amountHint":
    "အိမ်တစ်အိမ်လျှင် ပစ်မှတ်ကို အလိုအလျောက် တွက်ချက်ပါသည် - စုစုပေါင်း ÷ လက်ရှိ အသုံးပြုနေသော အိမ်အရေအတွက် (အပေါ်သို့ ပိုင်းသည်)။",
  "funds.create.submit": "ရန်ပုံငွေ ဖန်တီးရန်",
  "funds.create.submitting": "ရန်ပုံငွေ ဖန်တီးနေသည်...",
  "funds.create.errorTitle": "ရန်ပုံငွေ ဖန်တီး၍ မရပါ",
  "funds.create.generic": "ရန်ပုံငွေ ဖန်တီး၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "funds.edit.title": "ရန်ပုံငွေ ပြင်ဆင်ရန်",
  "funds.edit.description": "မူကြမ်း ရန်ပုံငွေများကိုသာ ပြင်ဆင်နိုင်သည်။",
  "funds.edit.submit": "ပြောင်းလဲမှုများ သိမ်းရန်",
  "funds.edit.submitting": "သိမ်းဆည်းနေသည်...",
  "funds.edit.errorTitle": "ပြောင်းလဲမှုများ သိမ်း၍ မရပါ",
  "funds.edit.generic": "ရန်ပုံငွေ ပြင်ဆင်၍ မရပါ။ ထပ်ကြိုးစားပါ။",

  // Cash payment collection (Feature K)
  "cashPay.title": "ငွေသား ငွေပေးချေမှုများ",
  "cashPay.description":
    "လက်ရှိ ရန်ပုံငွေအတွက် လက်ခံရရှိသော ငွေသားကို မှတ်တမ်းတင်ပါ။ ငွေသား ငွေပေးချေမှုများကို ချက်ချင်း လက်ခံသည်။",
  "cashPay.fundBadge": "အသုံးပြုနေသော ရန်ပုံငွေ - {name}",
  "cashPay.noFundTitle": "အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ",
  "cashPay.noFundBody":
    "သင့်ကျေးရွာတွင် ယခုအချိန် အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ။ ငွေသား ငွေပေးချေမှု မှတ်တမ်းတင်ခြင်းကို အသုံးပြု၍ မရပါ။",
  "cashPay.fund.eyebrow": "လက်ရှိ ရန်ပုံငွေ",
  "cashPay.fund.minPerHouse": "အိမ်တစ်အိမ်လျှင် အနည်းဆုံး",
  "cashPay.fund.formula":
    "စုစုပေါင်း ÷ အိမ် {count} လုံး (အပေါ်သို့ ပိုင်းသည်)",
  "cashPay.fund.total": "စီမံကိန်း စုစုပေါင်း ငွေပမာဏ",
  "cashPay.fund.note":
    "ငွေပေးချေမှုတိုင်းသည် အိမ်တစ်အိမ်လျှင် ကျသင့်ငွေထက် မလျော့ရပါ။ ပိုပေးခြင်းကို အပိုထည့်ဝင်ငွေအဖြစ် လက်ခံသည်။",
  "cashPay.fund.unavailableTitle": "ပေးချေရမည့် ပမာဏကို တွက်ချက်၍ မရပါ",
  "cashPay.form.title": "ငွေသား ငွေပေးချေမှု မှတ်တမ်းတင်ရန်",
  "cashPay.form.description":
    "အိမ်နှင့် ငွေပေးသူကို ရွေးပြီး လက်ခံရရှိသော ငွေသား ပမာဏကို ထည့်ပါ။",
  "cashPay.form.house": "အိမ်",
  "cashPay.form.housePlaceholder": "အိမ် ရွေးပါ",
  "cashPay.form.houseOption": "အိမ်နံပါတ် {number}",
  "cashPay.form.payer": "ငွေပေးသူ",
  "cashPay.form.payerPlaceholder": "ငွေပေးသူ ရွေးပါ",
  "cashPay.form.payerFirst": "အိမ်ကို အရင် ရွေးပါ",
  "cashPay.form.noMembers":
    "ဤအိမ်တွင် ရွေးချယ်ခွင့်ရှိသော လက်ရှိ အဖွဲ့ဝင် မရှိပါ။",
  "cashPay.form.amount": "လက်ခံရရှိသော ငွေပမာဏ",
  "cashPay.form.amountPlaceholder": "အနည်းဆုံး - {amount}",
  "cashPay.form.amountHint":
    "အနည်းဆုံး {amount} ဖြစ်ရမည်။ ပိုပေးခြင်းကို လက်ခံသည်။",
  "cashPay.form.useMinimum": "အနည်းဆုံး ({amount}) ထည့်ရန်",
  "cashPay.form.submit": "ငွေသား ငွေပေးချေမှု မှတ်တမ်းတင်ရန်",
  "cashPay.form.submitting": "မှတ်တမ်းတင်နေသည်...",
  "cashPay.form.success": "ငွေသား ငွေပေးချေမှုကို မှတ်တမ်းတင်ပြီးပါပြီ။",
  "cashPay.form.errorTitle": "ငွေပေးချေမှုကို မှတ်တမ်းတင်၍ မရပါ",
  "cashPay.form.errorGeneric":
    "ငွေသား ငွေပေးချေမှုကို မှတ်တမ်းတင်၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "cashPay.form.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "cashPay.list.title": "မကြာသေးမီက ငွေသား ငွေပေးချေမှုများ",
  "cashPay.list.description": "သင့်ကျေးရွာ၏ နောက်ဆုံး ငွေသား ငွေပေးချေမှုများ။",
  "cashPay.list.emptyTitle": "ငွေသား ငွေပေးချေမှု မရှိပါ",
  "cashPay.list.emptyBody":
    "ငွေသား ငွေပေးချေမှု မှတ်တမ်းတင်ထားခြင်း မရှိသေးပါ။",
  "cashPay.list.house": "အိမ်နံပါတ် {number}",
  "cashPay.list.voidReason": "ပယ်ဖျက်ရသည့် အကြောင်းရင်း",
  "cashPay.status.accepted": "လက်ခံပြီး",
  "cashPay.status.voided": "ပယ်ဖျက်ပြီး",
  "cashPay.void.open": "ဤငွေပေးချေမှုကို ပယ်ဖျက်ရန်",
  "cashPay.void.warning":
    "ငွေပေးချေမှုနှင့် ပြေစာကို ပယ်ဖျက်ပြီးအဖြစ် အမှတ်အသားပြုမည်ဖြစ်ပြီး သမိုင်းကြောင်း မှတ်တမ်းအဖြစ် ဆက်လက် သိမ်းထားမည်။",
  "cashPay.void.reason": "ပယ်ဖျက်ရသည့် အကြောင်းရင်း",
  "cashPay.void.reasonHint": "အနည်းဆုံး အက္ခရာ ၅ လုံး။",
  "cashPay.void.reasonPlaceholder":
    "ဤငွေပေးချေမှုကို အဘယ်ကြောင့် ပယ်ဖျက်ရသည်ကို ရှင်းပြပါ...",
  "cashPay.void.submit": "ငွေပေးချေမှု ပယ်ဖျက်ရန်",
  "cashPay.void.submitting": "ပယ်ဖျက်နေသည်...",
  "cashPay.void.errorTitle": "ငွေပေးချေမှုကို ပယ်ဖျက်၍ မရပါ",
  "cashPay.void.errorGeneric": "ငွေပေးချေမှုကို ပယ်ဖျက်၍ မရပါ။ ထပ်ကြိုးစားပါ။",

  // Receipts (Feature N)
  "receipts.back": "ပြေစာများသို့ ပြန်ရန်",
  "receipts.list.title": "ပြေစာများ",
  "receipts.list.description.village":
    "သင့်ကျေးရွာရှိ ငွေပေးချေမှု ပြေစာအားလုံး၊ အသစ်ဆုံးကို ရှေ့ဆုံးတွင် ပြထားသည်။",
  "receipts.list.description.collector":
    "သင်ကောက်ခံခဲ့သော သို့မဟုတ် ပေးချေခဲ့သော ငွေပေးချေမှုများ၏ ပြေစာများ၊ အသစ်ဆုံးကို ရှေ့ဆုံးတွင် ပြထားသည်။",
  "receipts.list.description.own":
    "သင့်ကိုယ်ပိုင် ငွေပေးချေမှုများ၏ ပြေစာများ၊ အသစ်ဆုံးကို ရှေ့ဆုံးတွင် ပြထားသည်။",
  "receipts.list.aria": "ပြေစာများ",
  "receipts.list.countOne": "ပြေစာ {count} ခု ပြသနေသည်",
  "receipts.list.countOther": "ပြေစာ {count} ခု ပြသနေသည်",
  "receipts.list.limitNote": "နောက်ဆုံး ပြေစာ {count} ခုကိုသာ ပြသထားသည်။",
  "receipts.list.emptyTitle": "ပြေစာ မရှိသေးပါ",
  "receipts.list.emptyBody":
    "ငွေပေးချေမှု လက်ခံသည့်အခါတိုင်း ပြေစာ ဖန်တီးပါသည်။",
  "receipts.detail.title": "ပြေစာ အသေးစိတ်",
  "receipts.detail.description": "ငွေပေးချေမှု ပြေစာ အချက်အလက်။",
  "receipts.status.active": "တရားဝင်",
  "receipts.status.voided": "ပယ်ဖျက်ပြီး",
  "receipts.method.kpay": "KPay",
  "receipts.method.cash": "ငွေသား",
  "receipts.hero.label": "ငွေပေးချေမှု ပမာဏ",
  "receipts.details.title": "ငွေပေးချေမှု အသေးစိတ်",
  "receipts.field.receiptNumber": "ပြေစာ နံပါတ်",
  "receipts.field.amount": "ငွေပမာဏ",
  "receipts.field.date": "ငွေပေးချေသည့်ရက်",
  "receipts.field.method": "ပေးချေပုံ",
  "receipts.field.fund": "ရန်ပုံငွေ",
  "receipts.field.house": "အိမ်",
  "receipts.field.payer": "ငွေပေးသူ",
  "receipts.field.collector": "ကောက်ခံသူ",
  "receipts.notProvided": "မဖော်ပြထားပါ",
  "receipts.kpay.title": "ယခင် KPay ငွေလွှဲမှု",
  "receipts.kpay.txn": "ငွေလွှဲ ID နောက်ဆုံး ဂဏန်း ၁၀ လုံး",
  "receipts.kpay.receiver": "ငွေလက်ခံသူ၏ KPay အကောင့်",
  "receipts.kpay.privacy":
    "ငွေပို့သူ၏ KPay အချက်အလက်များကို ကိုယ်ရေးလုံခြုံစွာ သိမ်းထားသည်။ ငွေလွှဲ ID နောက်ဆုံး ဂဏန်း ၁၀ လုံးနှင့် ငွေလက်ခံသူ အကောင့်ကိုသာ ပြသထားသည်။",
  "receipts.void.title": "ဤပြေစာကို ပယ်ဖျက်ပြီးဖြစ်သည်",
  "receipts.void.body": "သမိုင်းကြောင်း မှတ်တမ်းအဖြစ် ဆက်လက် သိမ်းထားသည်။",
  "receipts.void.reason": "ပယ်ဖျက်ရသည့် အကြောင်းရင်း",

  // Payment disputes (Feature O)
  "disputes.back": "အငြင်းပွားမှုများသို့ ပြန်ရန်",
  "disputes.list.title": "အငြင်းပွားမှုများ",
  "disputes.status.open": "ဖွင့်ထားသည်",
  "disputes.status.underReview": "စစ်ဆေးနေသည်",
  "disputes.status.resolved": "ဖြေရှင်းပြီး",
  "disputes.status.rejected": "ပယ်ချပြီး",
  "disputes.list.description.chief":
    "ကျေးရွာသားများ ယခင်တင်ပြထားသော ငွေပေးချေမှု အငြင်းပွားမှုများကို စစ်ဆေးပါ။",
  "disputes.list.description.own":
    "သင်ယခင်တင်ပြထားသော ငွေပေးချေမှု အငြင်းပွားမှုများ၏ အခြေအနေကို ကြည့်ပါ။",
  "disputes.list.filterLabel": "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
  "disputes.list.countOne": "အငြင်းပွားမှု {count} ခု",
  "disputes.list.countOther": "အငြင်းပွားမှု {count} ခု",
  "disputes.list.emptyTitle": "အငြင်းပွားမှု မရှိသေးပါ",
  "disputes.list.emptyBody.chief":
    "ကျေးရွာသားများထံမှ တင်ပြထားသော အငြင်းပွားမှု မရှိပါ။",
  "disputes.list.emptyBody.own":
    "သင်တင်ပြထားသော ငွေပေးချေမှု အငြင်းပွားမှု မရှိပါ။",
  "disputes.list.noMatchTitle": "ကိုက်ညီသော အငြင်းပွားမှု မတွေ့ပါ",
  "disputes.list.noMatchBody": "ဤအခြေအနေရှိ အငြင်းပွားမှု မရှိပါ။",
  "disputes.list.showAll": "အငြင်းပွားမှု အားလုံး ပြရန်",
  "disputes.filter.all": "အားလုံး",
  "disputes.card.house": "အိမ်နံပါတ် {number}",
  "disputes.card.raisedBy": "{name} က တင်ပြသည်",
  "disputes.detail.title": "အငြင်းပွားမှု အသေးစိတ်",
  "disputes.detail.description.chief":
    "ကျေးရွာသား၏ ရှင်းလင်းချက်နှင့် ယခင်ငွေပေးချေမှု အထောက်အထားကို စစ်ဆေးပြီး ဆုံးဖြတ်ပါ။",
  "disputes.detail.description.own":
    "သင့်အငြင်းပွားမှု၏ တိုးတက်မှုနှင့် အုပ်ချုပ်ရေးမှူး၏ ဆုံးဖြတ်ချက်ကို ကြည့်ရှုပါ။",
  "disputes.progress.label": "အငြင်းပွားမှု တိုးတက်မှု",
  "disputes.progress.raised": "တင်ပြပြီး",
  "disputes.progress.decision": "ဆုံးဖြတ်ချက်",
  "disputes.next.title": "နောက်ဆက်တွဲ ဖြစ်မည့်အရာ",
  "disputes.next.open":
    "သင့်အငြင်းပွားမှုကို စောင့်ဆိုင်းနေသည်။ အုပ်ချုပ်ရေးမှူးက မကြာမီ စစ်ဆေးမှု စတင်မည်။",
  "disputes.next.underReview":
    "အုပ်ချုပ်ရေးမှူးက သင့်ရှင်းလင်းချက်နှင့် ငွေပေးချေမှု မှတ်တမ်းများကို စစ်ဆေးနေသည်။",
  "disputes.next.resolved":
    "အုပ်ချုပ်ရေးမှူးက ဤအငြင်းပွားမှုကို သင့်ဘက်မှ ဖြေရှင်းပေးခဲ့သည်။ ယခင်ငွေပေးချေမှု မှတ်တမ်းကို မပြောင်းလဲပါ။",
  "disputes.next.rejected":
    "အုပ်ချုပ်ရေးမှူးက မူလ ပယ်ချမှုကို ထိန်းသိမ်းခဲ့သည်။ အုပ်ချုပ်ရေးမှူး၏ မှတ်ချက်ကို ဤစာမျက်နှာတွင် ကြည့်နိုင်သည်။",
  "disputes.closed.title": "ဆုံးဖြတ်ချက် မှတ်တမ်းတင်ပြီး",
  "disputes.closed.body":
    "ဤအငြင်းပွားမှုကို ဆုံးဖြတ်ပြီးဖြစ်သည်။ ဆက်လက်လုပ်ဆောင်စရာ မရှိတော့ပါ။",
  "disputes.field.raisedBy": "တင်ပြသူ",
  "disputes.field.date": "တင်ပြသည့်ရက်",
  "disputes.statement.title": "ရှင်းလင်းချက်",
  "disputes.note.title": "အုပ်ချုပ်ရေးမှူး၏ ဖြေရှင်းချက် မှတ်ချက်",
  "disputes.payment.title": "အငြင်းပွားသော ငွေပေးချေမှု",
  "disputes.payment.rejectionTitle": "ငွေပေးချေမှုကို ပယ်ချရသည့် အကြောင်းရင်း",
  "disputes.payment.fund": "ရန်ပုံငွေ",
  "disputes.payment.amount": "ငွေပမာဏ",
  "disputes.payment.house": "အိမ်",
  "disputes.payment.payer": "ငွေပေးသူ",
  "disputes.payment.date": "ငွေပေးချေသည့်ရက်",
  "disputes.proof.title": "ယခင် KPay ငွေပေးချေမှု အထောက်အထား",
  "disputes.proof.note": "ငွေပေးချေမှု မှတ်တမ်းမှ အလိုအလျောက် ယူထားသည်။",
  "disputes.proof.txn": "ငွေလွှဲ ID",
  "disputes.proof.receiver": "ငွေလက်ခံသူ၏ အကောင့်",
  "disputes.proof.collector": "ငွေလက်ခံသူ (ကောက်ခံသူ)",
  "disputes.proof.unknown": "မသိရပါ",
  "disputes.notProvided": "မဖော်ပြထားပါ",
  "disputes.actions.title": "သင်၏ ဆုံးဖြတ်ချက်",
  "disputes.review.title": "စစ်ဆေးမှု စတင်ရန်",
  "disputes.review.body":
    "ဖြေရှင်းခြင်း သို့မဟုတ် ပယ်ချခြင်း မပြုမီ ဤအငြင်းပွားမှုကို စစ်ဆေးနေသည်ဟု အမှတ်အသားပြုပါ။",
  "disputes.review.submit": "စစ်ဆေးမှု စတင်ရန်",
  "disputes.review.submitting": "စတင်နေသည်...",
  "disputes.resolve.title": "ကျေးရွာသားဘက်မှ ဖြေရှင်းရန်",
  "disputes.resolve.body":
    "ဖြေရှင်းခြင်းသည် ယခင်အငြင်းပွားမှုအတွက် ဆုံးဖြတ်ချက်ကို မှတ်တမ်းတင်သည်။ မူလ ငွေပေးချေမှု မှတ်တမ်းကို မပြောင်းလဲပါ။",
  "disputes.resolve.label": "ဖြေရှင်းချက် မှတ်ချက်",
  "disputes.resolve.placeholder": "မည်သို့ ဖြေရှင်းခဲ့သနည်း။",
  "disputes.resolve.hint":
    "အနည်းဆုံး အက္ခရာ ၅ လုံး။ ကျေးရွာသားက ဤမှတ်ချက်ကို မြင်ရမည်။",
  "disputes.resolve.submit": "အငြင်းပွားမှု ဖြေရှင်းရန်",
  "disputes.resolve.submitting": "ဖြေရှင်းနေသည်...",
  "disputes.reject.title": "အငြင်းပွားမှု ပယ်ချရန်",
  "disputes.reject.body":
    "ပယ်ချခြင်းသည် မူလ ငွေပေးချေမှု ပယ်ချမှုကို ထိန်းသိမ်းသည်။",
  "disputes.reject.label": "ပယ်ချရသည့် အကြောင်းရင်း",
  "disputes.reject.placeholder": "မူလ ပယ်ချမှုကို အဘယ်ကြောင့် ထိန်းသိမ်းသနည်း။",
  "disputes.reject.hint":
    "အနည်းဆုံး အက္ခရာ ၅ လုံး။ ကျေးရွာသားက ဤအကြောင်းရင်းကို မြင်ရမည်။",
  "disputes.reject.submit": "အငြင်းပွားမှု ပယ်ချရန်",
  "disputes.reject.submitting": "ပယ်ချနေသည်...",
  "disputes.decision.errorTitle": "ဆုံးဖြတ်ချက် သိမ်း၍ မရပါ",
  "disputes.form.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
};
