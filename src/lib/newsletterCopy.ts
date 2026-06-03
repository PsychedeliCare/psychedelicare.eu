import { normalizeLocale, type SiteLocale } from "./i18n";

export type NewsletterCopy = {
  emailLabel: string;
  emailPlaceholder: string;
  consentLabel: string;
  submitLabel: string;
  loadingLabel: string;
  successMessage: string;
  alreadySubscribedMessage: string;
  errorMessage: string;
  privacyLabel: string;
};

export const newsletterCopyByLocale: Record<SiteLocale, NewsletterCopy> = {
  en: {
    emailLabel: "Your Email address",
    emailPlaceholder: "you@example.com",
    consentLabel:
      "I agree to receive the PsychedeliCare nEUsletter and understand I can unsubscribe at any time.",
    submitLabel: "Subscribe",
    loadingLabel: "Subscribing…",
    successMessage: "Thank you! You are now subscribed to the nEUsletter.",
    alreadySubscribedMessage: "You are already subscribed to the nEUsletter.",
    errorMessage: "Something went wrong. Please try again in a moment.",
    privacyLabel: "Privacy Policy",
  },
  de: {
    emailLabel: "Deine E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    consentLabel:
      "Ich möchte den PsychedeliCare nEUsletter erhalten und weiß, dass ich mich jederzeit abmelden kann.",
    submitLabel: "Abonnieren",
    loadingLabel: "Wird abonniert…",
    successMessage: "Danke! Du bist jetzt für den nEUsletter angemeldet.",
    alreadySubscribedMessage: "Du bist bereits für den nEUsletter angemeldet.",
    errorMessage: "Etwas ist schiefgelaufen. Bitte versuche es gleich noch einmal.",
    privacyLabel: "Datenschutz",
  },
  el: {
    emailLabel: "Η διεύθυνση email σας",
    emailPlaceholder: "es@paradeigma.gr",
    consentLabel:
      "Συμφωνώ να λαμβάνω το nEUsletter του PsychedeliCare και γνωρίζω ότι μπορώ να διαγραφώ οποτεδήποτε.",
    submitLabel: "Εγγραφή",
    loadingLabel: "Εγγραφή σε εξέλιξη…",
    successMessage: "Ευχαριστούμε! Είστε πλέον εγγεγραμμένοι στο nEUsletter.",
    alreadySubscribedMessage: "Είστε ήδη εγγεγραμμένοι στο nEUsletter.",
    errorMessage: "Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο.",
    privacyLabel: "Πολιτική απορρήτου",
  },
  es: {
    emailLabel: "Tu dirección de correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    consentLabel:
      "Acepto recibir el nEUsletter de PsychedeliCare y entiendo que puedo darme de baja en cualquier momento.",
    submitLabel: "Suscribirse",
    loadingLabel: "Suscribiendo…",
    successMessage: "Gracias. Ya estás suscrito al nEUsletter.",
    alreadySubscribedMessage: "Ya estás suscrito al nEUsletter.",
    errorMessage: "Algo salió mal. Inténtalo de nuevo en un momento.",
    privacyLabel: "Política de privacidad",
  },
  eu: {
    emailLabel: "Zure email helbidea",
    emailPlaceholder: "zu@adibidea.eus",
    consentLabel:
      "PsychedeliCare-ren nEUsletter-a jasotzea onartzen dut eta edozein unetan baja eman dezakedala ulertzen dut.",
    submitLabel: "Harpidetu",
    loadingLabel: "Harpidetzen…",
    successMessage: "Eskerrik asko! nEUsletter-era harpidetuta zaude.",
    alreadySubscribedMessage: "nEUsletter-era dagoeneko harpidetuta zaude.",
    errorMessage: "Zerbait gaizki joan da. Saiatu berriro une bat barru.",
    privacyLabel: "Pribatutasun politika",
  },
  fr: {
    emailLabel: "Votre adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    consentLabel:
      "J’accepte de recevoir le nEUsletter de PsychedeliCare et je comprends que je peux me désinscrire à tout moment.",
    submitLabel: "S’abonner",
    loadingLabel: "Inscription en cours…",
    successMessage: "Merci ! Vous êtes inscrit·e au nEUsletter.",
    alreadySubscribedMessage: "Vous êtes déjà inscrit·e au nEUsletter.",
    errorMessage: "Une erreur s’est produite. Veuillez réessayer dans un instant.",
    privacyLabel: "Politique de confidentialité",
  },
  hr: {
    emailLabel: "Vaša adresa e-pošte",
    emailPlaceholder: "vi@primjer.hr",
    consentLabel:
      "Slažem se primati PsychedeliCare nEUsletter i razumijem da se mogu odjaviti u bilo kojem trenutku.",
    submitLabel: "Pretplati se",
    loadingLabel: "Pretplata u tijeku…",
    successMessage: "Hvala! Sada ste pretplaćeni na nEUsletter.",
    alreadySubscribedMessage: "Već ste pretplaćeni na nEUsletter.",
    errorMessage: "Nešto je pošlo po krivu. Pokušajte ponovno za trenutak.",
    privacyLabel: "Pravila privatnosti",
  },
  it: {
    emailLabel: "Il tuo indirizzo email",
    emailPlaceholder: "tu@esempio.it",
    consentLabel:
      "Accetto di ricevere il nEUsletter di PsychedeliCare e so che posso annullare l’iscrizione in qualsiasi momento.",
    submitLabel: "Iscriviti",
    loadingLabel: "Iscrizione in corso…",
    successMessage: "Grazie! Sei iscritto al nEUsletter.",
    alreadySubscribedMessage: "Sei già iscritto al nEUsletter.",
    errorMessage: "Qualcosa è andato storto. Riprova tra un momento.",
    privacyLabel: "Informativa sulla privacy",
  },
  pl: {
    emailLabel: "Twój adres e-mail",
    emailPlaceholder: "ty@przyklad.pl",
    consentLabel:
      "Zgadzam się otrzymywać nEUsletter PsychedeliCare i rozumiem, że mogę wypisać się w dowolnym momencie.",
    submitLabel: "Zapisz się",
    loadingLabel: "Zapisywanie…",
    successMessage: "Dziękujemy! Jesteś zapisany do nEUslettera.",
    alreadySubscribedMessage: "Jesteś już zapisany do nEUslettera.",
    errorMessage: "Coś poszło nie tak. Spróbuj ponownie za chwilę.",
    privacyLabel: "Polityka prywatności",
  },
  pt: {
    emailLabel: "O teu endereço de email",
    emailPlaceholder: "tu@exemplo.pt",
    consentLabel:
      "Aceito receber o nEUsletter da PsychedeliCare e compreendo que posso cancelar a subscrição a qualquer momento.",
    submitLabel: "Subscrever",
    loadingLabel: "A subscrever…",
    successMessage: "Obrigado! Estás subscrito ao nEUsletter.",
    alreadySubscribedMessage: "Já estás subscrito ao nEUsletter.",
    errorMessage: "Algo correu mal. Tenta novamente daqui a instantes.",
    privacyLabel: "Política de privacidade",
  },
  sl: {
    emailLabel: "Tvoj e-poštni naslov",
    emailPlaceholder: "ti@primer.si",
    consentLabel:
      "Strinjam se s prejemanjem nEUsletterja PsychedeliCare in razumem, da se lahko kadarkoli odjavim.",
    submitLabel: "Naroči se",
    loadingLabel: "Naročanje…",
    successMessage: "Hvala! Naročen si na nEUsletter.",
    alreadySubscribedMessage: "Na nEUsletter si že naročen.",
    errorMessage: "Nekaj je šlo narobe. Poskusi znova čez trenutek.",
    privacyLabel: "Politika zasebnosti",
  },
  ca: {
    emailLabel: "La teva adreça electrònica",
    emailPlaceholder: "tu@exemple.cat",
    consentLabel:
      "Accepto rebre el nEUsletter de PsychedeliCare i entenc que puc donar-me de baixa en qualsevol moment.",
    submitLabel: "Subscriure’m",
    loadingLabel: "Subscrivint…",
    successMessage: "Gràcies! Ja estàs subscrit al nEUsletter.",
    alreadySubscribedMessage: "Ja estàs subscrit al nEUsletter.",
    errorMessage: "Alguna cosa ha anat malament. Torna-ho a provar d’aquí a un moment.",
    privacyLabel: "Política de privacitat",
  },
};

export function getNewsletterCopy(locale: string): NewsletterCopy {
  return newsletterCopyByLocale[normalizeLocale(locale)];
}
