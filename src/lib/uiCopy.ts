import { normalizeLocale, type SiteLocale } from "./i18n";

type UiCopy = {
  homeLabel: string;
  browseSection: string;
  browseItemPrefix: string;
  languages: string;
  support: string;
  menu: string;
  footerHeading: string;
  footerBody: string;
  footerContact: string;
  footerMedia: string;
  footerLinks: string;
  supportCampaign: string;
  onThisPage: string;
};

export const uiCopyByLocale: Record<SiteLocale, UiCopy> = {
  en: {
    homeLabel: "Home",
    browseSection: "Browse section",
    browseItemPrefix: "Browse",
    languages: "Languages",
    support: "Support",
    menu: "Menu",
    footerHeading: "A European initiative for safe, ethical mental health care.",
    footerBody:
      "Explore the campaign, follow the evidence, and stay connected with the movement across Europe.",
    footerContact: "Contact",
    footerMedia: "Media",
    footerLinks: "Footer links",
    supportCampaign: "Support the campaign",
    onThisPage: "On this page",
  },
  de: {
    homeLabel: "Start",
    browseSection: "Bereich ansehen",
    browseItemPrefix: "Zu",
    languages: "Sprachen",
    support: "Unterstuetzen",
    menu: "Menue",
    footerHeading:
      "Eine europaeische Initiative fuer sichere und ethische psychische Gesundheitsversorgung.",
    footerBody:
      "Entdecken Sie die Kampagne, verfolgen Sie die Entwicklungen und bleiben Sie mit der Bewegung in ganz Europa verbunden.",
    footerContact: "Kontakt",
    footerMedia: "Medien",
    footerLinks: "Footer-Links",
    supportCampaign: "Kampagne unterstuetzen",
    onThisPage: "Auf dieser Seite",
  },
  el: {
    homeLabel: "Αρχικη",
    browseSection: "Περιηγηση στην ενοτητα",
    browseItemPrefix: "Δειτε",
    languages: "Γλωσσες",
    support: "Στηριξη",
    menu: "Μενού",
    footerHeading:
      "Μια ευρωπαϊκή πρωτοβουλία για ασφαλή και ηθική φροντίδα ψυχικής υγείας.",
    footerBody:
      "Εξερευνήστε την καμπάνια, παρακολουθήστε τις εξελίξεις και μείνετε συνδεδεμένοι με το κίνημα σε όλη την Ευρώπη.",
    footerContact: "Επικοινωνία",
    footerMedia: "Μέσα",
    footerLinks: "Σύνδεσμοι υποσέλιδου",
    supportCampaign: "Στηριξτε την καμπανια",
    onThisPage: "Σε αυτη τη σελιδα",
  },
  es: {
    homeLabel: "Inicio",
    browseSection: "Explorar seccion",
    browseItemPrefix: "Ver",
    languages: "Idiomas",
    support: "Apoyar",
    menu: "Menu",
    footerHeading:
      "Una iniciativa europea por una atencion a la salud mental segura y etica.",
    footerBody:
      "Explora la campana, sigue los avances y mantente conectada con el movimiento en toda Europa.",
    footerContact: "Contacto",
    footerMedia: "Medios",
    footerLinks: "Enlaces del pie de pagina",
    supportCampaign: "Apoyar la campana",
    onThisPage: "En esta pagina",
  },
  eu: {
    homeLabel: "Hasiera",
    browseSection: "Atala arakatu",
    browseItemPrefix: "Ikusi",
    languages: "Hizkuntzak",
    support: "Babestu",
    menu: "Menua",
    footerHeading:
      "Europako ekimen bat osasun mentalerako arreta seguru eta etikoaren alde.",
    footerBody:
      "Arakatu kanpaina, jarraitu aurrerapenei eta egon konektatuta Europako mugimenduarekin.",
    footerContact: "Harremana",
    footerMedia: "Komunikabideak",
    footerLinks: "Orri-oinaren estekak",
    supportCampaign: "Babestu kanpaina",
    onThisPage: "Orrialde honetan",
  },
  fr: {
    homeLabel: "Accueil",
    browseSection: "Parcourir la section",
    browseItemPrefix: "Voir",
    languages: "Langues",
    support: "Soutenir",
    menu: "Menu",
    footerHeading:
      "Une initiative européenne pour des soins de santé mentale sûrs et éthiques.",
    footerBody:
      "Explorez la campagne, suivez les avancées et restez en lien avec le mouvement à travers l'Europe.",
    footerContact: "Contact",
    footerMedia: "Medias",
    footerLinks: "Liens du pied de page",
    supportCampaign: "Soutenir la campagne",
    onThisPage: "Sur cette page",
  },
  hr: {
    homeLabel: "Pocetna",
    browseSection: "Pregledaj odjeljak",
    browseItemPrefix: "Pogledaj",
    languages: "Jezici",
    support: "Podrzi",
    menu: "Izbornik",
    footerHeading:
      "Europska inicijativa za sigurnu i eticnu skrb o mentalnom zdravlju.",
    footerBody:
      "Istrazite kampanju, pratite napredak i ostanite povezani s pokretom diljem Europe.",
    footerContact: "Kontakt",
    footerMedia: "Mediji",
    footerLinks: "Veze u podnozju",
    supportCampaign: "Podrzi kampanju",
    onThisPage: "Na ovoj stranici",
  },
  it: {
    homeLabel: "Home",
    browseSection: "Esplora la sezione",
    browseItemPrefix: "Vai a",
    languages: "Lingue",
    support: "Sostieni",
    menu: "Menu",
    footerHeading:
      "Un'iniziativa europea per una salute mentale sicura ed etica.",
    footerBody:
      "Esplora la campagna, segui gli sviluppi e resta connessa al movimento in tutta Europa.",
    footerContact: "Contatti",
    footerMedia: "Media",
    footerLinks: "Link a piè di pagina",
    supportCampaign: "Sostieni la campagna",
    onThisPage: "In questa pagina",
  },
  pl: {
    homeLabel: "Strona glowna",
    browseSection: "Przegladaj sekcje",
    browseItemPrefix: "Zobacz",
    languages: "Jezyki",
    support: "Wesprzyj",
    menu: "Menu",
    footerHeading:
      "Europejska inicjatywa na rzecz bezpiecznej i etycznej opieki nad zdrowiem psychicznym.",
    footerBody:
      "Poznaj kampanie, sledz postepy i pozostan w kontakcie z ruchem w calej Europie.",
    footerContact: "Kontakt",
    footerMedia: "Media",
    footerLinks: "Linki w stopce",
    supportCampaign: "Wesprzyj kampanie",
    onThisPage: "Na tej stronie",
  },
  pt: {
    homeLabel: "Inicio",
    browseSection: "Explorar secao",
    browseItemPrefix: "Ver",
    languages: "Idiomas",
    support: "Apoiar",
    menu: "Menu",
    footerHeading:
      "Uma iniciativa europeia por cuidados de saude mental seguros e eticos.",
    footerBody:
      "Explore a campanha, acompanhe os avancos e mantenha-se ligada ao movimento em toda a Europa.",
    footerContact: "Contacto",
    footerMedia: "Media",
    footerLinks: "Links do rodape",
    supportCampaign: "Apoiar a campanha",
    onThisPage: "Nesta pagina",
  },
  sl: {
    homeLabel: "Domov",
    browseSection: "Razišci razdelek",
    browseItemPrefix: "Poglej",
    languages: "Jeziki",
    support: "Podpri",
    menu: "Meni",
    footerHeading:
      "Evropska pobuda za varno in eticno skrb za dusevno zdravje.",
    footerBody:
      "Razišcite kampanjo, spremljajte napredek in ostanite povezani z gibanjem po vsej Evropi.",
    footerContact: "Kontakt",
    footerMedia: "Mediji",
    footerLinks: "Povezave v nogi",
    supportCampaign: "Podpri kampanjo",
    onThisPage: "Na tej strani",
  },
  ca: {
    homeLabel: "Inici",
    browseSection: "Explora la seccio",
    browseItemPrefix: "Veure",
    languages: "Idiomes",
    support: "Dona suport",
    menu: "Menu",
    footerHeading:
      "Una iniciativa europea per a una atencio a la salut mental segura i etica.",
    footerBody:
      "Explora la campanya, segueix els avenços i mantingues el contacte amb el moviment arreu d'Europa.",
    footerContact: "Contacte",
    footerMedia: "Mitjans",
    footerLinks: "Enllacos del peu de pagina",
    supportCampaign: "Dona suport a la campanya",
    onThisPage: "En aquesta pagina",
  },
};

export function getUiCopy(locale: string): UiCopy {
  return uiCopyByLocale[normalizeLocale(locale)];
}
