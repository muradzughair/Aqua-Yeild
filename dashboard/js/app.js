
/* ---------------- icon helpers ---------------- */
const ICONS = {
  drop: '<path d="M12 2c3 4 6 7.5 6 11.5A6 6 0 0 1 6 13.5C6 9.5 9 6 12 2z"/>',
  flask: '<path d="M9 2v6L4 19a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 19L15 8V2"/><path d="M9 2h6"/>',
  therm: '<path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0Z"/>',
  vial: '<path d="M9 2h6M12 2v6M8 8h8l3 11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3L8 8Z"/>',
  waves: '<path d="M2 8c1.5 1.5 3 1.5 4.5 0S9 6.5 10.5 8 13.5 9.5 15 8s3-1.5 4.5 0M2 14c1.5 1.5 3 1.5 4.5 0S9 12.5 10.5 14s3 1.5 4.5 0 3-1.5 4.5 0M2 20c1.5 1.5 3 1.5 4.5 0S9 18.5 10.5 20s3 1.5 4.5 0 3-1.5 4.5 0"/>',
  salinity: '<path d="M6 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9Z"/><path d="M16 9c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9Z"/>',
  waterlevel: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 13h16"/>',
};
function icon(name, extra=''){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name]}</svg>`; }

/* ---------------- i18n ---------------- */
let currentLang = 'en';
/* pick the Arabic field ("xAr") when in Arabic mode, falling back to the English one */
function T(o, k){ if(currentLang === 'ar' && o[k+'Ar'] !== undefined) return o[k+'Ar']; return o[k]; }
function txt(key){ const dict = I18N[currentLang] || I18N.en; return dict[key] !== undefined ? dict[key] : (I18N.en[key] || ''); }
function healthLabel(h){
  if(currentLang !== 'ar') return h;
  const map = { Good:'جيد', Warning:'تحذير', Critical:'حرج', '--':'--' };
  return map[h] !== undefined ? map[h] : h;
}

const I18N = {
  en: {
    'nav.dashboard':'Dashboard', 'nav.ai':'AI Suggestions', 'nav.alerts':'Alerts', 'nav.history':'History &amp; Trends',
    'nav.device':'Device Status', 'nav.tanks':'Tanks', 'nav.reports':'Reports', 'nav.settings':'Settings', 'nav.help':'Help &amp; Support',
    'sidebar.helpText':"Need help? We're here for you.", 'sidebar.contactSupport':'Contact Support',
    'topbar.tank1':'Tank 1', 'topbar.tank2':'Tank 2', 'topbar.tank3':'Tank 3', 'topbar.tank4':'Tank 4',
    'topbar.online':'Online', 'topbar.syncWaiting':'Waiting for device sim…', 'topbar.syncLinked':'Live-synced with device sim', 'topbar.userName':'Aqua Farmer',
    'dash.title':'Dashboard', 'dash.subtitle':'Live overview of Tank 1.', 'dash.overallHealth':'Overall Tank Health',
    'dash.lastUpdated':'Last Updated', 'dash.deviceStatus':'Device Status', 'dash.liveParams':'Live Water Parameters',
    'dash.recentAlerts':'Recent Alerts', 'dash.viewAll':'View All', 'dash.quickOverview':'Quick Overview',
    'dash.avgDo':'Average DO (Today)', 'dash.avgPh':'Average pH (Today)', 'dash.avgTemp':'Water Temp (Avg)',
    'dash.healthGood':'All parameters are in safe range.', 'dash.healthAttention':'Attention needed on {tank} — check flagged parameters below.',
    'dash.feedTitle':'Feeding Suggestion', 'dash.feedText':'Feed 1.2 kg of feed at 11:00 AM today.',
    'dash.warnTitle':'Early-Warning Suggestion', 'dash.warnText':'Ammonia is rising. Check your filtration system.',
    'ai.subtitle':'', 'ai.tabAll':'All Suggestions', 'ai.tabFeeding':'Feeding', 'ai.tabWarnings':'Early Warnings',
    'ai.feedTitle':'Feeding Suggestion', 'ai.chipOptimization':'Optimization', 'ai.feedTime':'Today, 10:30 AM', 'ai.feedText':'Feed 1.2 kg of feed at 11:00 AM today.',
    'ai.applySchedule':'Apply Schedule', 'ai.whyAmount':'Why this amount?',
    'ai.warnTitle':'Early-Warning Suggestion', 'ai.chipAlert':'Alert', 'ai.warnTime':'Today, 09:15 AM',
    'ai.warnText':'Ammonia is rising (+0.2 ppm). Check your filtration system and reduce feeding slightly.', 'ai.viewDetails':'View Details',
    'ai.harvestTitle':'Harvest-Timing Forecast', 'ai.chipForecast':'Forecast', 'ai.harvestTime':'Yesterday, 06:00 PM',
    'ai.bestTime':'Best time to harvest:', 'ai.harvestNote':'(High growth &amp; good market price)', 'ai.viewForecast':'View Forecast',
    'ai.generalTitle':'General Recommendation', 'ai.generalTime':'May 16, 02:30 PM', 'ai.generalText':'Water quality is stable. Keep up the good work!',
    'alerts.subtitle':'Manage notifications and system anomalies.', 'alerts.all':'All Alerts', 'alerts.active':'Active', 'alerts.resolved':'Resolved', 'alerts.filter':'Filter',
    'alerts.critical':'Critical', 'alerts.warning':'Warning', 'alerts.info':'Info',
    'hist.subtitle':'Analyze water quality parameters over time.', 'hist.last30':'Last 30 Days', 'hist.last7':'Last 7 Days', 'hist.last90':'Last 90 Days',
    'hist.exportData':'Export Data', 'hist.parameters':'Parameters', 'hist.ammonia':'Ammonia (NH₃)', 'hist.do':'Dissolved Oxygen', 'hist.temp':'Temperature', 'hist.ph':'pH Level',
    'hist.chartType':'Chart Type', 'hist.line':'Line', 'hist.bar':'Bar', 'hist.ammoniaTrends':'Ammonia (NH₃) Trends', 'hist.optimalRange':'Optimal range: 0 – 0.5 mg/L',
    'hist.criticalLimit':'Critical Limit', 'hist.average':'Average', 'hist.minimum':'Minimum', 'hist.maximum':'Maximum', 'hist.stdDev':'Std. Dev',
    'device.subtitle':"Power, connectivity, and hardware info for Tank 1's sensor box.", 'device.powerStatus':'Power Status', 'device.battery':'Battery 82%',
    'device.solarCharging':'☀️ Solar Charging', 'device.good':'Good', 'device.connStatus':'Connectivity Status', 'device.wifiConnected':'WiFi Connected',
    'device.signalStrength':'Signal Strength: <b>Strong</b>', 'device.dataCurrent':'Data is current', 'device.lastReboot':'Last Reboot',
    'device.deviceInfo':'Device Information', 'device.deviceId':'Device ID', 'device.firmware':'Firmware Version', 'device.deviceModel':'Device Model',
    'device.deviceModelValue':'AquaYield Box Pro', 'device.installedOn':'Installed On', 'device.location':'Location', 'device.locationValue':'Farm – North Pond',
    'tanks.subtitle':'Manage and monitor all active aquaculture systems.', 'tanks.addTank':'Add Tank', 'tanks.lastUpdated':'Last updated:',
    'tanks.online':'Online', 'tanks.offline':'Offline', 'tanks.health':'Health', 'tanks.temp':'Temp', 'tanks.do':'DO', 'tanks.viewDetails':'View Details ›',
    'reports.subtitle':'Generate and view automated water quality reports.', 'reports.newReport':'New Report',
    'reports.tabRecent':'Recent Reports', 'reports.tabScheduled':'Scheduled', 'reports.tabArchived':'Archived', 'reports.loadMore':'Load More Reports',
    'reports.scheduleReport':'Schedule Report', 'reports.reportType':'Report Type', 'reports.comprehensive':'Comprehensive Water Quality',
    'reports.feedingSummary':'Feeding Summary', 'reports.alertsSummary':'Alerts Summary', 'reports.frequency':'Frequency', 'reports.weekly':'Weekly',
    'reports.daily':'Daily', 'reports.monthly':'Monthly', 'reports.recipients':'Recipients (Emails)', 'reports.saveSetup':'Save Setup',
    'reports.storageUsed':'Storage Used', 'reports.quota':'24% of 5GB Quota', 'reports.view':'View', 'reports.pdf':'↓ PDF', 'reports.csv':'↓ CSV',
    'settings.subtitle':'Manage your account, alerts, and app preferences.',
    'help.subtitle':'Reach the AquaYield team or browse quick answers.',
    'help.text':'Have a question about your readings, an alert, or your device? Our support team typically replies within a few hours.', 'help.browseFaq':'Browse FAQ',
  },
  ar: {
    'nav.dashboard':'لوحة التحكم', 'nav.ai':'اقتراحات الذكاء الاصطناعي', 'nav.alerts':'التنبيهات', 'nav.history':'السجل والاتجاهات',
    'nav.device':'حالة الجهاز', 'nav.tanks':'الخزانات', 'nav.reports':'التقارير', 'nav.settings':'الإعدادات', 'nav.help':'المساعدة والدعم',
    'sidebar.helpText':'هل تحتاج مساعدة؟ نحن هنا من أجلك.', 'sidebar.contactSupport':'تواصل مع الدعم',
    'topbar.tank1':'الخزان 1', 'topbar.tank2':'الخزان 2', 'topbar.tank3':'الخزان 3', 'topbar.tank4':'الخزان 4',
    'topbar.online':'متصل', 'topbar.syncWaiting':'بانتظار محاكي الجهاز…', 'topbar.syncLinked':'مزامنة مباشرة مع محاكي الجهاز', 'topbar.userName':'مزارع الأحياء المائية',
    'dash.title':'لوحة التحكم', 'dash.subtitle':'نظرة مباشرة على الخزان 1.', 'dash.overallHealth':'الحالة العامة للخزان',
    'dash.lastUpdated':'آخر تحديث', 'dash.deviceStatus':'حالة الجهاز', 'dash.liveParams':'معايير المياه المباشرة',
    'dash.recentAlerts':'أحدث التنبيهات', 'dash.viewAll':'عرض الكل', 'dash.quickOverview':'نظرة سريعة',
    'dash.avgDo':'متوسط الأكسجين الذائب (اليوم)', 'dash.avgPh':'متوسط الأس الهيدروجيني (اليوم)', 'dash.avgTemp':'متوسط درجة حرارة الماء',
    'dash.healthGood':'جميع المعايير ضمن النطاق الآمن.', 'dash.healthAttention':'يلزم الانتباه في {tank} — تحقق من المعايير المُعلَّمة أدناه.',
    'dash.feedTitle':'اقتراح تغذية', 'dash.feedText':'أطعم 1.2 كجم من العلف الساعة 11:00 صباحًا اليوم.',
    'dash.warnTitle':'اقتراح إنذار مبكر', 'dash.warnText':'الأمونيا في ارتفاع. تحقق من نظام الترشيح لديك.',
    'ai.subtitle':'رؤى قابلة للتنفيذ للخزان 1.', 'ai.tabAll':'كل الاقتراحات', 'ai.tabFeeding':'التغذية', 'ai.tabWarnings':'الإنذارات المبكرة',
    'ai.feedTitle':'اقتراح تغذية', 'ai.chipOptimization':'تحسين', 'ai.feedTime':'اليوم، 10:30 ص', 'ai.feedText':'أطعم 1.2 كجم من العلف الساعة 11:00 صباحًا اليوم.',
    'ai.applySchedule':'تطبيق الجدول', 'ai.whyAmount':'لماذا هذه الكمية؟',
    'ai.warnTitle':'اقتراح إنذار مبكر', 'ai.chipAlert':'تنبيه', 'ai.warnTime':'اليوم، 09:15 ص',
    'ai.warnText':'الأمونيا في ارتفاع (+0.2 جزء بالمليون). تحقق من نظام الترشيح وقلّل التغذية قليلًا.', 'ai.viewDetails':'عرض التفاصيل',
    'ai.harvestTitle':'توقّع موعد الحصاد', 'ai.chipForecast':'توقّع', 'ai.harvestTime':'أمس، 06:00 م',
    'ai.bestTime':'أفضل وقت للحصاد:', 'ai.harvestNote':'(نمو مرتفع وسعر سوق جيد)', 'ai.viewForecast':'عرض التوقّع',
    'ai.generalTitle':'توصية عامة', 'ai.generalTime':'16 مايو، 02:30 م', 'ai.generalText':'جودة المياه مستقرة. استمر في العمل الجيد!',
    'alerts.subtitle':'إدارة الإشعارات وحالات الشذوذ في النظام.', 'alerts.all':'كل التنبيهات', 'alerts.active':'نشطة', 'alerts.resolved':'تم حلّها', 'alerts.filter':'تصفية',
    'alerts.critical':'حرج', 'alerts.warning':'تحذير', 'alerts.info':'معلومة',
    'hist.subtitle':'تحليل معايير جودة المياه عبر الزمن.', 'hist.last30':'آخر 30 يومًا', 'hist.last7':'آخر 7 أيام', 'hist.last90':'آخر 90 يومًا',
    'hist.exportData':'تصدير البيانات', 'hist.parameters':'المعايير', 'hist.ammonia':'الأمونيا (NH₃)', 'hist.do':'الأكسجين الذائب', 'hist.temp':'درجة الحرارة', 'hist.ph':'مستوى الأس الهيدروجيني',
    'hist.chartType':'نوع الرسم البياني', 'hist.line':'خطي', 'hist.bar':'أعمدة', 'hist.ammoniaTrends':'اتجاهات الأمونيا (NH₃)', 'hist.optimalRange':'النطاق الأمثل: 0 – 0.5 ملغ/لتر',
    'hist.criticalLimit':'الحد الحرج', 'hist.average':'المتوسط', 'hist.minimum':'الحد الأدنى', 'hist.maximum':'الحد الأقصى', 'hist.stdDev':'الانحراف المعياري',
    'device.subtitle':'معلومات الطاقة والاتصال والعتاد لصندوق مستشعرات الخزان 1.', 'device.powerStatus':'حالة الطاقة', 'device.battery':'البطارية 82٪',
    'device.solarCharging':'☀️ شحن بالطاقة الشمسية', 'device.good':'جيد', 'device.connStatus':'حالة الاتصال', 'device.wifiConnected':'متصل بشبكة WiFi',
    'device.signalStrength':'قوة الإشارة: <b>قوية</b>', 'device.dataCurrent':'البيانات محدّثة', 'device.lastReboot':'آخر إعادة تشغيل',
    'device.deviceInfo':'معلومات الجهاز', 'device.deviceId':'معرّف الجهاز', 'device.firmware':'إصدار البرنامج الثابت', 'device.deviceModel':'طراز الجهاز',
    'device.deviceModelValue':'AquaYield Box Pro', 'device.installedOn':'تاريخ التركيب', 'device.location':'الموقع', 'device.locationValue':'المزرعة – البركة الشمالية',
    'tanks.subtitle':'إدارة ومراقبة جميع أنظمة تربية الأحياء المائية النشطة.', 'tanks.addTank':'إضافة خزان', 'tanks.lastUpdated':'آخر تحديث:',
    'tanks.online':'متصل', 'tanks.offline':'غير متصل', 'tanks.health':'الحالة', 'tanks.temp':'الحرارة', 'tanks.do':'الأكسجين الذائب', 'tanks.viewDetails':'‹ عرض التفاصيل',
    'reports.subtitle':'إنشاء وعرض تقارير جودة المياه التلقائية.', 'reports.newReport':'تقرير جديد',
    'reports.tabRecent':'التقارير الأخيرة', 'reports.tabScheduled':'المجدولة', 'reports.tabArchived':'المؤرشفة', 'reports.loadMore':'تحميل المزيد من التقارير',
    'reports.scheduleReport':'جدولة تقرير', 'reports.reportType':'نوع التقرير', 'reports.comprehensive':'جودة مياه شاملة',
    'reports.feedingSummary':'ملخص التغذية', 'reports.alertsSummary':'ملخص التنبيهات', 'reports.frequency':'التكرار', 'reports.weekly':'أسبوعي',
    'reports.daily':'يومي', 'reports.monthly':'شهري', 'reports.recipients':'المستلمون (البريد الإلكتروني)', 'reports.saveSetup':'حفظ الإعداد',
    'reports.storageUsed':'التخزين المستخدم', 'reports.quota':'24٪ من حصة 5 جيجابايت', 'reports.view':'عرض', 'reports.pdf':'↓ PDF', 'reports.csv':'↓ CSV',
    'settings.subtitle':'إدارة حسابك والتنبيهات وتفضيلات التطبيق.',
    'help.subtitle':'تواصل مع فريق AquaYield أو تصفّح الأسئلة الشائعة.',
    'help.text':'هل لديك سؤال حول قراءاتك أو تنبيه أو جهازك؟ عادةً ما يرد فريق الدعم خلال بضع ساعات.', 'help.browseFaq':'تصفّح الأسئلة الشائعة',
  }
};

function applyLanguage(lang){
  currentLang = lang;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtnLabel').textContent = lang === 'ar' ? 'English' : 'العربية';

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const dict = I18N[lang] || I18N.en;
    if(dict[key] !== undefined) el.innerHTML = dict[key];
  });

  setSyncConnected(syncConnected);
  const head = document.querySelector('#page-dashboard .page-head p');
  if(head){
    const names = lang === 'ar' ? TANK_NAME_BY_ID_AR : TANK_NAME_BY_ID;
    const lead = lang === 'ar' ? 'نظرة مباشرة على' : 'Live overview of';
    head.textContent = `${lead} ${names[selectedTankId] || 'Tank '+selectedTankId}.`;
  }
  updateHealthCard(selectedTankId);
  renderParams();
  renderDashboardPanels();
  renderAlertsPage(document.querySelector('#alertSeg button.active')?.dataset.filter || 'all');
  renderTanks();
  renderReports();
  renderSettings();
  try{ localStorage.setItem('__aquayield_lang__', lang); }catch(e){}
}

document.getElementById('langToggle').addEventListener('click', ()=>{
  applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
});

/* ---------------- data ---------------- */
const params = [
  {key:'do',      name:'Dissolved Oxygen (DO)', nameAr:'الأكسجين الذائب (DO)', value:'6.5', unit:'mg/L', min:0, max:10, safeMin:5, safeMax:8, pos:65, icon:'drop', color:'#3b7dd8', range:'5 - 8 mg/L'},
  {key:'ph',      name:'pH', nameAr:'الأس الهيدروجيني (pH)', value:'7.2', unit:'', min:0, max:14, safeMin:6.5, safeMax:8.5, pos:51, icon:'flask', color:'#7a5cff', range:'6.5 - 8.5'},
  {key:'temp',    name:'Temperature', nameAr:'درجة الحرارة', value:'28.4', unit:'°C', min:15, max:40, safeMin:24, safeMax:30, pos:53, icon:'therm', color:'#e04338', range:'24 - 30 °C'},
  {key:'ammonia', name:'Ammonia (NH₃)', nameAr:'الأمونيا (NH₃)', value:'0.15', unit:'mg/L', min:0, max:1, safeMin:0, safeMax:0.5, pos:30, icon:'vial', color:'#a05cff', range:'0 - 0.5 mg/L'},
  {key:'turb',    name:'Turbidity (Cloudiness)', nameAr:'العكارة', value:'12', unit:'NTU', min:0, max:25, safeMin:0, safeMax:15, pos:48, icon:'waves', color:'#12b3c9', range:'0 - 25 NTU'},
  {key:null,      name:'Salinity / Conductivity', nameAr:'الملوحة / التوصيلية', value:'1.2', unit:'mS/cm', min:0, max:2, safeMin:0.5, safeMax:2, pos:60, icon:'salinity', color:'#d68910', range:'0.5 - 2.0 mS/cm'},
  {key:null,      name:'Water Level', nameAr:'مستوى الماء', value:'85', unit:'%', min:20, max:100, safeMin:20, safeMax:100, pos:82, icon:'waterlevel', color:'#1a9c72', range:'20 - 100 %'},
];

const alerts = [
  {sev:'critical', title:'High Ammonia', titleAr:'ارتفاع الأمونيا', sub:'Ammonia level is 0.75 mg/L', subAr:'مستوى الأمونيا 0.75 ملغ/لتر', time:'Today, 10:25 AM', timeAr:'اليوم، 10:25 ص', active:true},
  {sev:'warning', title:'Low Dissolved Oxygen', titleAr:'انخفاض الأكسجين الذائب', sub:'DO level is 3.8 mg/L', subAr:'مستوى الأكسجين الذائب 3.8 ملغ/لتر', time:'Today, 09:15 AM', timeAr:'اليوم، 09:15 ص', active:true},
  {sev:'warning', title:'High Temperature', titleAr:'ارتفاع درجة الحرارة', sub:'Temperature is 31.2 °C', subAr:'درجة الحرارة 31.2 °م', time:'Yesterday, 06:40 PM', timeAr:'أمس، 06:40 م', active:false},
  {sev:'info', title:'Device Reconnected', titleAr:'إعادة اتصال الجهاز', sub:'Your device is back online', subAr:'جهازك متصل الآن بالإنترنت', time:'Yesterday, 05:20 PM', timeAr:'أمس، 05:20 م', active:false},
];

const tanks = [
  {id:1, name:'Tank 1', nameAr:'الخزان 1', updated:'Today, 10:30 AM', updatedAr:'اليوم، 10:30 ص', online:true, health:'Good', temp:'28.4 °C', do:'6.5 mg/L', warn:false},
  {id:2, name:'Tank 2', nameAr:'الخزان 2', updated:'Today, 10:28 AM', updatedAr:'اليوم، 10:28 ص', online:true, health:'Warning', temp:'31.2 °C', do:'5.8 mg/L', warn:true},
  {id:3, name:'Tank 3', nameAr:'الخزان 3', updated:'Yesterday, 05:50 PM', updatedAr:'أمس، 05:50 م', online:false, health:'--', temp:'--', do:'--', warn:false, offline:true},
  {id:4, name:'Tank 4', nameAr:'الخزان 4', updated:'Today, 09:40 AM', updatedAr:'اليوم، 09:40 ص', online:true, health:'Good', temp:'24.1 °C', do:'7.2 mg/L', warn:false},
];

const reports = [
  {type:'pdf', name:'Weekly Water Quality Summary', nameAr:'ملخص أسبوعي لجودة المياه', meta:'Oct 15 – Oct 21, 2023 · 2.4 MB', metaAr:'15 أكتوبر – 21 أكتوبر 2023 · 2.4 م.بايت', tag:'System Generated', tagAr:'تم إنشاؤه تلقائيًا', action:'PDF'},
  {type:'csv', name:'Sensor Data Export – Tank 1', nameAr:'تصدير بيانات المستشعر – الخزان 1', meta:'Oct 01 – Oct 15, 2023 · 156 KB', metaAr:'01 أكتوبر – 15 أكتوبر 2023 · 156 ك.بايت', tag:'Manual Export', tagAr:'تصدير يدوي', action:'CSV'},
  {type:'pdf', name:'Monthly Health Assessment', nameAr:'تقييم صحي شهري', meta:'September 2023 · 4.1 MB', metaAr:'سبتمبر 2023 · 4.1 م.بايت', tag:'System Generated', tagAr:'تم إنشاؤه تلقائيًا', action:'PDF'},
];

const settings = [
  {icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>', title:'Profile Settings', titleAr:'إعدادات الملف الشخصي', sub:'Manage your profile information', subAr:'إدارة معلومات ملفك الشخصي'},
  {icon:'<path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z"/><path d="M10.5 20a1.7 1.7 0 0 0 3 0"/>', title:'Notification Settings', titleAr:'إعدادات الإشعارات', sub:'Manage push & SMS preferences', subAr:'إدارة تفضيلات الإشعارات والرسائل النصية'},
  {icon:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>', title:'Alert Preferences', titleAr:'تفضيلات التنبيهات', sub:'Set alert thresholds & rules', subAr:'تحديد حدود وقواعد التنبيهات'},
  {icon:'<path d="M3 6h18M3 12h18M3 18h12"/>', title:'Units', titleAr:'وحدات القياس', sub:'Choose measurement units', subAr:'اختر وحدات القياس'},
  {icon:'<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', title:'Account & Security', titleAr:'الحساب والأمان', sub:'Manage password and security', subAr:'إدارة كلمة المرور والأمان'},
  {icon:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z"/>', title:'Language', titleAr:'اللغة', sub:'English', subAr:'العربية'},
  {icon:'<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>', title:'About AquaYield', titleAr:'حول AquaYield', sub:'Version 1.2.3', subAr:'الإصدار 1.2.3'},
];

/* ---------------- render helpers ---------------- */
function severityColors(sev){
  return sev === 'critical' ? {bg:'var(--red-100)', fg:'var(--red-600)'} :
         sev === 'warning' ? {bg:'var(--amber-100)', fg:'var(--amber-600)'} :
         {bg:'#e6efff', fg:'var(--blue-500)'};
}
function alertIconSvg(sev){
  if(sev==='critical') return '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>';
  if(sev==='warning') return '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>';
  return '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>';
}

function renderParams(){
  const grid = document.getElementById('paramsGrid');
  grid.innerHTML = params.map(p => {
    const sev = paramSeverity(p);
    const cls = sev === 'crit' ? 'is-critical' : sev === 'warn' ? 'is-warning' : '';
    return `
    <div class="card param-card ${cls}" data-key="${p.key||''}">
      <span class="live-flag">LIVE</span>
      <div class="param-top">
        <div class="param-icon" style="background:${p.color}22; color:${p.color};">${icon(p.icon)}</div>
        <div class="param-name">${T(p,'name')}</div>
      </div>
      <div class="param-value">${p.value}<span class="unit">${p.unit}</span></div>
      <div class="gauge-track" style="background:linear-gradient(90deg, var(--green-500) 0 60%, var(--amber-500) 60% 82%, var(--red-500) 82% 100%);">
        <div class="gauge-marker" style="left:${p.pos}%;"></div>
      </div>
      <div class="gauge-range"><span>${p.range.split(' - ')[0] || p.range}</span><span>${p.range}</span></div>
    </div>`;
  }).join('');
}
function paramSeverity(p){
  if(p.value === '--' || p.value === undefined) return 'ok';
  const v = parseFloat(p.value);
  if(isNaN(v)) return 'ok';
  if(v >= p.safeMin && v <= p.safeMax) return 'ok';
  const span = p.safeMax - p.safeMin;
  const dev = v < p.safeMin ? p.safeMin - v : v - p.safeMax;
  return dev > span*0.2 ? 'crit' : 'warn';
}
function flashParamCard(key){
  const card = document.querySelector(`.param-card[data-key="${key}"]`);
  if(!card) return;
  card.classList.add('flash');
  setTimeout(()=> card.classList.remove('flash'), 900);
}

function renderDashboardPanels(){
  document.getElementById('dashSugg').innerHTML = `
    <div class="sugg-row">
      <div class="row-icon" style="background:var(--teal-50); color:var(--teal-600);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l16 8-16 8V4Z"/></svg></div>
      <div><p class="row-title">${txt('dash.feedTitle')}</p><p class="row-sub">${txt('dash.feedText')}</p></div>
    </div>
    <div class="sugg-row">
      <div class="row-icon" style="background:var(--amber-100); color:var(--amber-600);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg></div>
      <div><p class="row-title">${txt('dash.warnTitle')}</p><p class="row-sub">${txt('dash.warnText')}</p></div>
    </div>`;
}

function renderAlertsPage(filter='all'){
  let list = alerts;
  if(filter === 'active') list = alerts.filter(a=>a.active);
  if(filter === 'resolved') list = alerts.filter(a=>!a.active);
  document.getElementById('alertsList').innerHTML = list.map(a=>{
    const label = a.sev==='critical'? txt('alerts.critical') : a.sev==='warning'? txt('alerts.warning') : txt('alerts.info');
    return `<div class="alert-item ${a.sev}">
      <div class="row-icon" style="background:${severityColors(a.sev).bg}; color:${severityColors(a.sev).fg}; width:34px;height:34px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${alertIconSvg(a.sev)}</svg>
      </div>
      <div class="body">
        <p class="row-title">${T(a,'title')}</p>
        <p class="row-sub">${T(a,'sub')}</p>
      </div>
      <div class="alert-meta">
        <span class="badge ${a.sev}">${label}</span>
        <span class="row-time">${T(a,'time')}</span>
      </div>
    </div>`;
  }).join('');
}

function renderTanks(){
  document.getElementById('tanksGrid').innerHTML = tanks.map(t=>`
    <div class="card tank-card ${t.offline?'offline':''}">
      <div class="tank-card-top">
        <div class="tank-card-id">
          <div class="tank-avatar ${t.offline?'off':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg></div>
          <div>
            <div class="tank-name">${T(t,'name')}</div>
            <div class="tank-updated">${txt('tanks.lastUpdated')} ${T(t,'updated')}</div>
          </div>
        </div>
        <span class="status-pill" style="${t.online? '' : 'background:var(--ink-100); color:var(--ink-500);'}">
          <span class="dot" style="${t.online? '' : 'background:var(--ink-400);'}"></span> ${t.online? txt('tanks.online') : txt('tanks.offline')}
        </span>
      </div>
      <div class="tank-stats">
        <div class="tank-stat"><div class="l">${txt('tanks.health')}</div><div class="v ${t.warn?'warn':(t.offline?'':'good')}">${healthLabel(t.health)}</div></div>
        <div class="tank-stat"><div class="l">${txt('tanks.temp')}</div><div class="v ${t.warn?'warn':''}">${t.temp}</div></div>
        <div class="tank-stat"><div class="l">${txt('tanks.do')}</div><div class="v">${t.do}</div></div>
      </div>
      <div class="tank-card-foot"><a href="#">${txt('tanks.viewDetails')}</a></div>
    </div>
  `).join('');
}

function renderReports(){
  document.getElementById('reportsList').innerHTML = reports.map(r=>`
    <div class="report-item">
      <div class="report-icon ${r.type==='csv'?'csv':''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
      </div>
      <div>
        <p class="report-name">${T(r,'name')}</p>
        <p class="report-meta">${T(r,'meta')}</p>
        <span class="report-tag">${T(r,'tag')}</span>
      </div>
      <div class="report-actions">
        ${r.action==='PDF' ? `<button class="btn-secondary">${txt('reports.view')}</button><button class="btn-secondary">${txt('reports.pdf')}</button>` : `<button class="btn-secondary">${txt('reports.csv')}</button>`}
      </div>
    </div>
  `).join('');
}

function renderSettings(){
  document.getElementById('settingsList').innerHTML = settings.map(s=>`
    <div class="settings-item">
      <div class="settings-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.icon}</svg></div>
      <div><p class="settings-title">${T(s,'title')}</p><p class="settings-sub">${T(s,'sub')}</p></div>
      <div class="settings-right">${currentLang==='ar' ? '‹' : '›'}</div>
    </div>
  `).join('');
}

/* ---------------- nav / interactivity ---------------- */
function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.page===page));
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click', ()=>goTo(n.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(n=>n.addEventListener('click', e=>{e.preventDefault(); goTo(n.dataset.pageLink);}));

document.getElementById('alertSeg').addEventListener('click', e=>{
  const btn = e.target.closest('button'); if(!btn) return;
  document.querySelectorAll('#alertSeg button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderAlertsPage(btn.dataset.filter);
});

document.querySelectorAll('.tabs').forEach(tabgroup=>{
  tabgroup.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    tabgroup.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.tab){
      const cat = btn.dataset.tab;
      document.querySelectorAll('#page-ai .sugg-card').forEach(c=>{
        c.style.display = (cat==='all' || c.dataset.cat===cat || (cat==='warnings' && c.dataset.cat==='warnings')) ? 'flex' : 'none';
      });
    }
  });
});

/* =========================================================================
   AQUALINK — receiving end of the real-time bridge from the 3D device
   simulation (File 1). See the matching comment block in that file for the
   full explanation of the transport (BroadcastChannel + localStorage relay,
   same-origin required).
   ========================================================================= */
const AquaLink = (() => {
  const CHANNEL = 'aquayield-sync-v1';
  const LS_KEY   = '__aquayield_sync_msg__';
  let bc = null;
  try { bc = new BroadcastChannel(CHANNEL); } catch(e) { bc = null; }
  const listeners = [];
  function onMessage(fn){ listeners.push(fn); }
  function dispatch(msg){ listeners.forEach(fn => { try{ fn(msg); }catch(e){ console.error(e); } }); }
  if(bc){ bc.onmessage = (e) => dispatch(e.data); }
  window.addEventListener('storage', (e) => {
    if(e.key !== LS_KEY || !e.newValue) return;
    try{ dispatch(JSON.parse(e.newValue)); }catch(err){}
  });
  function send(msg){
    const payload = Object.assign({ _t: Date.now(), _r: Math.random() }, msg);
    if(bc){ try{ bc.postMessage(payload); }catch(e){} }
    try{ localStorage.setItem(LS_KEY, JSON.stringify(payload)); }catch(e){}
  }
  return { send, onMessage };
})();

let selectedTankId = 1;
let syncConnected = false;
const paramByKey = {}; params.forEach(p => { if(p.key) paramByKey[p.key] = p; });
let alertUid = 1000;
const alertState = {}; // `${tankId}:${key}` -> 'ok' | 'warn' | 'crit'
const paramNames = { do:'Dissolved Oxygen', ph:'pH', temp:'Temperature', ammonia:'Ammonia', turb:'Turbidity' };

function setSyncConnected(v){
  if(syncConnected !== v) logEvent(v ? 'Device simulator connected' : 'Device simulator disconnected');
  syncConnected = v;
  const pill = document.getElementById('syncPill');
  const text = document.getElementById('syncPillText');
  pill.classList.toggle('linked', v);
  text.textContent = v ? txt('topbar.syncLinked') : txt('topbar.syncWaiting');
}

function severityOf(value, safeMin, safeMax){
  if(value >= safeMin && value <= safeMax) return 'ok';
  const span = safeMax - safeMin;
  const dev = value < safeMin ? safeMin - value : value - safeMax;
  return dev > span*0.2 ? 'crit' : 'warn';
}

function updateHealthCard(tankId){
  const t = tanks.find(x => x.id === tankId);
  if(!t) return;
  const valueEl = document.querySelector('.health-value');
  const subEl = document.querySelector('.health-sub');
  const iconWrap = document.querySelector('.health-icon');
  if(!valueEl) return;
  const colorMap = { Good:['var(--green-600)','var(--green-100)'], Warning:['var(--amber-600)','var(--amber-100)'], Critical:['var(--red-600)','var(--red-100)'] };
  const [fg,bg] = colorMap[t.health] || colorMap.Good;
  valueEl.textContent = healthLabel(t.health);
  valueEl.style.color = fg;
  if(iconWrap){ iconWrap.style.background = bg; const svg = iconWrap.querySelector('svg'); if(svg) svg.style.color = fg; }
  if(subEl){
    if(t.health === 'Good') subEl.textContent = txt('dash.healthGood');
    else subEl.textContent = txt('dash.healthAttention').replace('{tank}', T(t,'name').split(' - ')[0]);
  }
}

/* Rolling log of things that changed in the app (alerts fired/cleared,
   readings crossing thresholds, tank/sync events). The AI assistant reads
   this so it can talk about *what changed*, not just the current snapshot. */
const recentEvents = [];
function logEvent(text, tankId){
  recentEvents.unshift({
    text,
    tank: TANK_NAME_BY_ID[tankId] || null,
    ts: new Date().toISOString()
  });
  if(recentEvents.length > 30) recentEvents.length = 30;
}

function pushAlert(sev, title, sub, tankId){
  alerts.unshift({ sev, title, sub, time:'Just now', active:true, _uid: alertUid++ });
  if(alerts.length > 40) alerts.length = 40;
  logEvent(`New ${sev} alert — ${title}: ${sub}`, tankId);
}
function resolveAlert(title, tankId){
  const a = alerts.find(x => x.title === title && x.active);
  if(a){ a.active = false; logEvent(`Resolved — ${title} back to normal`, tankId); }
}

function applyReading(tankId, readingParams){
  const tankName = (TANK_NAME_BY_ID[tankId] || `Tank ${tankId}`);
  let worstThisTank = 'ok';

  Object.keys(readingParams).forEach(key=>{
    const p = paramByKey[key];
    if(!p) return;
    const v = readingParams[key];
    const sev = severityOf(v, p.safeMin, p.safeMax);
    if(sev === 'crit') worstThisTank = 'crit';
    else if(sev === 'warn' && worstThisTank !== 'crit') worstThisTank = 'warn';

    const stateKey = tankId + ':' + key;
    const prevSev = alertState[stateKey] || 'ok';
    const label = paramNames[key] || key;
    const direction = v < p.safeMin ? 'Low' : 'High';
    const alertTitle = `${direction} ${label}${tankId!==1 ? ' — '+tankName.split(' - ')[0] : ''}`;

    if(sev !== 'ok' && prevSev === 'ok'){
      pushAlert(sev === 'crit' ? 'critical' : 'warning', alertTitle, `${label} reading is ${formatVal(v,p)}${p.unit}`, tankId);
    } else if(sev === 'ok' && prevSev !== 'ok'){
      resolveAlert(alertTitle, tankId);
    } else if(sev !== 'ok' && sev !== prevSev){
      // e.g. warn -> crit or crit -> warn: still worth telling the AI about
      logEvent(`${label} severity changed ${prevSev} → ${sev} (${formatVal(v,p)}${p.unit})`, tankId);
    }
    alertState[stateKey] = sev;

    // only mutate the visible params/gauges when this reading is for the tank currently on screen
    if(tankId === selectedTankId){
      p.value = formatVal(v, p);
      p.pos = Math.max(0, Math.min(100, ((v - p.min) / (p.max - p.min)) * 100));
    }
  });

  // keep the Tanks overview + tank cards in sync regardless of which tank is on screen
  const t = tanks.find(x => x.id === tankId);
  if(t){
    t.online = true; t.offline = false; t.updated = 'Just now';
    if(readingParams.temp !== undefined) t.temp = readingParams.temp.toFixed(1) + ' °C';
    if(readingParams.do !== undefined) t.do = readingParams.do.toFixed(1) + ' mg/L';
    t.health = worstThisTank === 'crit' ? 'Critical' : worstThisTank === 'warn' ? 'Warning' : 'Good';
    t.warn = worstThisTank !== 'ok';
  }

  if(tankId === selectedTankId){
    renderParams();
    renderDashboardPanels();
    renderAlertsPage(document.querySelector('#alertSeg button.active')?.dataset.filter || 'all');
    updateHealthCard(tankId);
    Object.keys(readingParams).forEach(key => flashParamCard(key));
    const metaVal = document.querySelectorAll('.meta-value')[0];
    if(metaVal) metaVal.textContent = 'Just now';
  }
  renderTanks();
}
function formatVal(v, p){
  const decimals = p.key === 'ammonia' ? 2 : (p.key === 'turb' ? 1 : 1);
  return (Math.round(v * Math.pow(10,decimals)) / Math.pow(10,decimals)).toString();
}

const TANK_NAME_BY_ID = { 1:'Tank 1', 2:'Tank 2', 3:'Tank 3', 4:'Tank 4' };
const TANK_NAME_BY_ID_AR = { 1:'الخزان 1', 2:'الخزان 2', 3:'الخزان 3', 4:'الخزان 4' };

function switchSelectedTank(tankId, opts={}){
  selectedTankId = tankId;
  const head = document.querySelector('#page-dashboard .page-head p');
  const names = currentLang === 'ar' ? TANK_NAME_BY_ID_AR : TANK_NAME_BY_ID;
  const lead = currentLang === 'ar' ? 'نظرة مباشرة على' : 'Live overview of';
  if(head) head.textContent = `${lead} ${names[tankId] || 'Tank '+tankId}.`;
  const h1 = document.querySelector('#page-dashboard .page-head h1');
  updateHealthCard(tankId);
  renderParams();
  renderDashboardPanels();
  renderAlertsPage();
  if(!opts.silent) AquaLink.send({ type:'tankSelect', tank: tankId });
}

document.getElementById('tankPicker').addEventListener('change', (e)=>{
  const idx = e.target.selectedIndex + 1;
  if(idx > 3){
    // Tank 4 has no linked simulation device in this prototype
    const head = document.querySelector('#page-dashboard .page-head p');
    if(head) head.textContent = currentLang === 'ar'
      ? 'نظرة مباشرة على الخزان 4 (لا يوجد جهاز مباشر مرتبط).'
      : 'Live overview of Tank 4 (no live device linked).';
    return;
  }
  switchSelectedTank(idx);
});

AquaLink.onMessage((msg)=>{
  if(!msg || !msg.type) return;
  setSyncConnected(true);
  if(msg.type === 'sensorUpdate'){
    applyReading(msg.tank, msg.params);
  } else if(msg.type === 'tankSelect'){
    if(msg.tank <= 3 && msg.tank !== selectedTankId){
      document.getElementById('tankPicker').selectedIndex = msg.tank - 1;
      switchSelectedTank(msg.tank, { silent:true });
    }
  } else if(msg.type === 'requestState'){
    AquaLink.send({ type:'pong' });
  }
});

// ask the simulation (if already open) to push its current readings immediately
AquaLink.send({ type:'requestState' });

/* =========================================================================
   ASK AQUAYIELD AI — Groq-backed aquaculture expert.
   The API key lives in js/config.js (git-ignored, local only) as
   window.AQUAYIELD_AI_CONFIG. See js/config.example.js for the template.
   There is no in-app field for it, so the end user of the dashboard can
   never see or change it from the UI.

   NOTE: even kept out of git, this key still ends up embedded in plain
   text in the page once loaded in a browser. Anyone who opens this page
   (view-source, devtools, etc.) can read it and use your quota. Fine for
   a private prototype/demo running locally; for anything deployed
   publicly, the request should go through a small backend that holds
   the key server-side instead of the browser calling Groq directly.
   ========================================================================= */
const AI_CONFIG = window.AQUAYIELD_AI_CONFIG || { apiKey: '', model: 'openai/gpt-oss-120b' };
// The real key now lives in js/config.js (git-ignored, local only).
// See js/config.example.js for the template that IS committed.

const aiQuestionEl = document.getElementById('aiQuestion');
const aiAskBtn = document.getElementById('aiAskBtn');
const aiLoadingEl = document.getElementById('aiLoading');
const aiAnswerEl = document.getElementById('aiAnswer');

document.querySelectorAll('.ai-quick-chip').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    aiQuestionEl.value = btn.dataset.prompt;
    askAquaAI(btn.dataset.prompt);
  });
});
aiAskBtn.addEventListener('click', ()=>{
  const q = aiQuestionEl.value.trim();
  if(q) askAquaAI(q);
});
aiQuestionEl.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); aiAskBtn.click(); }
});

function buildTankContext(){
  const t = tanks.find(x => x.id === selectedTankId) || tanks[0];
  const readings = params.map(p => `- ${p.name}: ${p.value}${p.unit} (safe range ${p.range})`).join('\n');
  const activeAlerts = alerts.filter(a => a.active).map(a => `- ${a.title}: ${a.sub}`).join('\n') || 'None';
  const recent = recentEvents.slice(0, 12)
    .map(e => `- ${e.text}${e.tank ? ' ['+e.tank+']' : ''}`)
    .join('\n') || 'No changes logged yet this session.';
  return `Tank: ${TANK_NAME_BY_ID[selectedTankId] || 'Tank ' + selectedTankId}
Overall health: ${t ? t.health : 'Unknown'}
Live sensor readings:
${readings}
Active alerts:
${activeAlerts}
Recent changes in the app (most recent first):
${recent}`;
}

async function askAquaAI(question){
  if(!AI_CONFIG.apiKey || AI_CONFIG.apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE'){
    aiAnswerEl.textContent = 'No Groq API key configured. Set AI_CONFIG.apiKey near the bottom of the <script> in this file.';
    aiAnswerEl.className = 'ai-answer show error';
    return;
  }
  aiLoadingEl.classList.add('show');
  aiAnswerEl.classList.remove('show', 'error');
  aiAskBtn.disabled = true;

  const systemPrompt = `You are a decision system for an aquaculture / RAS (recirculating aquaculture system) monitoring app in Aqaba, Jordan. You are given live sensor readings, active alerts, and a recent-changes log. Do NOT explain, do NOT teach, do NOT add caveats or background — the farmer needs an instant decision, not a lesson.

Respond with ONLY a single compact JSON object, nothing else — no markdown, no code fences, no prose outside the JSON. Schema:
{"severity":"critical|warning|ok","headline":"<max 10 words, the single most important fact right now>","actions":["<imperative action, max 8 words>", "...up to 4 max, ordered by priority, only if action is actually needed"]}
If everything is fine, use severity "ok" and return an empty actions array. Never include markdown syntax, tables, or explanations inside the JSON string values.`;
  const userPrompt = `${buildTankContext()}\n\nFarmer's question: ${question}`;

  try{
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if(!res.ok){
      const errBody = await res.text().catch(()=> '');
      throw new Error(`Groq error ${res.status}: ${errBody.slice(0,200)}`);
    }
    const data = await res.json();
    const raw = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';
    if(!raw) throw new Error('No response content returned.');

    renderAiDecision(raw);
  }catch(err){
    aiAnswerEl.textContent = 'Could not get a response: ' + err.message;
    aiAnswerEl.className = 'ai-answer show error';
  }finally{
    aiLoadingEl.classList.remove('show');
    aiAskBtn.disabled = false;
  }
}

function renderAiDecision(raw){
  let parsed;
  try{
    const cleaned = raw.trim().replace(/^```json\s*|^```\s*|```$/g, '');
    parsed = JSON.parse(cleaned);
  }catch(e){
    aiAnswerEl.textContent = raw;
    aiAnswerEl.className = 'ai-answer show';
    return;
  }
  const sev = ['critical','warning','ok'].includes(parsed.severity) ? parsed.severity : 'ok';
  const sevLabel = sev === 'critical' ? 'Critical' : sev === 'warning' ? 'Warning' : 'OK';
  const headline = (parsed.headline || '').toString();
  const actions = Array.isArray(parsed.actions) ? parsed.actions.slice(0,4) : [];

  aiAnswerEl.innerHTML = `
    <div class="ai-decision">
      <div class="ai-decision-head">
        <span class="ai-decision-badge ${sev}">${sevLabel}</span>
      </div>
      ${headline ? `<div class="ai-decision-headline">${escapeHtml(headline)}</div>` : ''}
      ${actions.length ? `<ul class="ai-decision-actions">${actions.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>` : ''}
    </div>`;
  aiAnswerEl.className = 'ai-answer show';
}

function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* init */
renderParams();
renderDashboardPanels();
renderAlertsPage();
renderTanks();
renderReports();
renderSettings();

let savedLang = 'en';
try{ savedLang = localStorage.getItem('__aquayield_lang__') || 'en'; }catch(e){}
if(savedLang === 'ar') applyLanguage('ar');
