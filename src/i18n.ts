import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        how: "How it works",
        generator: "Generator",
        dashboard: "Dashboard",
        about: "About",
        cta: "Get started",
        language: "Language",
      },
      hero: {
        badge: "AI co-pilot for founders & creatives",
        title1: "Turn your idea into a",
        title2: "fundable business.",
        subtitle:
          "GrantFlow AI helps you structure your idea, prepare grant applications, map your business journey, and generate the next steps to launch.",
        ctaPrimary: "Start building your plan",
        ctaSecondary: "See how it works",
      },
      cookies: {
        text: "We use cookies to improve your experience and measure traffic. You can change your mind at any time.",
        accept: "Accept",
        reject: "Reject",
      },
      waitlist: {
        badge: "Pre-launch waitlist",
        title1: "Be first when we",
        title2: "launch",
        subtitle:
          "Drop your email and we'll send you a single message the day GrantFlow AI is live. No spam, no newsletter — just one launch notice.",
        emailPlaceholder: "you@email.com",
        submit: "Join waitlist",
        popupSubtitle:
          "GrantFlow AI is in beta. Join the waitlist and we'll email you the moment we open the doors.",
        successToast: "You're on the waitlist! We'll email you at launch.",
        alreadyToast: "You're already on the list — see you at launch!",
        errorToast: "Something went wrong. Please try again.",
        invalidEmail: "Please enter a valid email",
        thanks: "Thanks! We'll be in touch when we launch.",
      },
    },
  },
  sv: {
    translation: {
      nav: {
        how: "Så funkar det",
        generator: "Generator",
        dashboard: "Översikt",
        about: "Om oss",
        cta: "Kom igång",
        language: "Språk",
      },
      hero: {
        badge: "AI-co-pilot för grundare och kreatörer",
        title1: "Förvandla din idé till ett",
        title2: "finansierbart företag.",
        subtitle:
          "GrantFlow AI hjälper dig strukturera din idé, förbereda bidragsansökningar, kartlägga din affärsresa och ta nästa steg mot lansering.",
        ctaPrimary: "Bygg din plan",
        ctaSecondary: "Se hur det fungerar",
      },
      cookies: {
        text: "Vi använder cookies för att förbättra din upplevelse och mäta trafik. Du kan ändra dig när som helst.",
        accept: "Acceptera",
        reject: "Avvisa",
      },
      waitlist: {
        badge: "Väntelista inför lansering",
        title1: "Var först när vi",
        title2: "lanserar",
        subtitle:
          "Lämna din e-post så skickar vi ett enda meddelande den dag GrantFlow AI går live. Ingen spam, inget nyhetsbrev — bara en lanseringsnotis.",
        emailPlaceholder: "du@epost.se",
        submit: "Gå med på väntelistan",
        popupSubtitle:
          "GrantFlow AI är i beta. Gå med på väntelistan så hör vi av oss så fort vi öppnar.",
        successToast: "Du är med på väntelistan! Vi mejlar dig vid lansering.",
        alreadyToast: "Du finns redan med — vi ses vid lansering!",
        errorToast: "Något gick fel. Försök igen.",
        invalidEmail: "Ange en giltig e-postadress",
        thanks: "Tack! Vi hör av oss vid lansering.",
      },
    },
  },
  ar: {
    translation: {
      nav: {
        how: "كيف يعمل",
        generator: "المولّد",
        dashboard: "لوحة التحكم",
        about: "من نحن",
        cta: "ابدأ الآن",
        language: "اللغة",
      },
      hero: {
        badge: "مساعد ذكاء اصطناعي للمؤسسين والمبدعين",
        title1: "حوّل فكرتك إلى",
        title2: "مشروع قابل للتمويل.",
        subtitle:
          "يساعدك GrantFlow AI على هيكلة فكرتك، وإعداد طلبات المنح، ورسم خريطة رحلتك التجارية، وتوليد الخطوات التالية للانطلاق.",
        ctaPrimary: "ابدأ ببناء خطتك",
        ctaSecondary: "شاهد كيف يعمل",
      },
      cookies: {
        text: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وقياس الزيارات. يمكنك تغيير رأيك في أي وقت.",
        accept: "قبول",
        reject: "رفض",
      },
      waitlist: {
        badge: "قائمة الانتظار قبل الإطلاق",
        title1: "كن أول من يعرف عند",
        title2: "الإطلاق",
        subtitle:
          "اترك بريدك الإلكتروني وسنرسل لك رسالة واحدة فقط يوم إطلاق GrantFlow AI. بدون إزعاج، بدون نشرات — مجرد إشعار واحد.",
        emailPlaceholder: "you@email.com",
        submit: "انضم لقائمة الانتظار",
        popupSubtitle:
          "GrantFlow AI في مرحلة تجريبية. انضم لقائمة الانتظار وسنراسلك فور الإطلاق.",
        successToast: "أنت على قائمة الانتظار! سنراسلك عند الإطلاق.",
        alreadyToast: "أنت بالفعل على القائمة — نراك عند الإطلاق!",
        errorToast: "حدث خطأ ما. حاول مرة أخرى.",
        invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
        thanks: "شكراً! سنتواصل معك عند الإطلاق.",
      },
    },
  },
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "sv", label: "Svenska", short: "SV" },
  { code: "ar", label: "العربية", short: "AR" },
] as const;

export const RTL_LANGUAGES = new Set(["ar"]);

export const applyLanguageDirection = (lng: string) => {
  if (typeof document === "undefined") return;
  const dir = RTL_LANGUAGES.has(lng) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "sv", "ar"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "gf_lang",
    },
  });

applyLanguageDirection(i18n.language);
i18n.on("languageChanged", applyLanguageDirection);

export default i18n;
