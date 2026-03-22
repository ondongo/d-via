/**
 * Chemins des assets SVG sous /public/icons.
 * Convention : kebab-case, dossiers par domaine (dashboard/nav, dashboard/artisan-card).
 */
export const ICONS = {
  /** Localisation & carte */
  locationBlue: "/icons/location-blue.svg",
  locationBrown: "/icons/location-brown.svg",
  locationOutline: "/icons/location-outline.svg",
  mapPin: "/icons/map-pin.svg",

  /** Actions */
  phone: "/icons/phone.svg",
  download: "/icons/download.svg",
  search: "/icons/search.svg",
  searchBlue: "/icons/search-blue.svg",
  send: "/icons/send.svg",
  camera: "/icons/camera.svg",
  /** Pièce jointe (ex. messagerie) */
  attachment: "/icons/attachment.svg",
  trash: "/icons/trash.svg",

  /** Fichiers & médias */
  document: "/icons/document.svg",
  photo: "/icons/photo.svg",
  file: "/icons/file.svg",
  fileWhite: "/icons/file-white.svg",
  draft: "/icons/draft.svg",
  draftPrimary: "/icons/draft-primary.svg",

  /** Statut & feedback */
  alert: "/icons/alert.svg",
  badgeCertified: "/icons/badge-certified.svg",
  checkCircle: "/icons/check-circle.svg",

  /** Personas / landing */
  artisans: "/icons/artisans.svg",
  particulars: "/icons/particulars.svg",
  userAvatar: "/icons/user-avatar.svg",
  chartPlus: "/icons/chart-plus.svg",
  starSparkle: "/icons/star-sparkle.svg",
  rapid: "/icons/rapid.svg",
  selectionZone: "/icons/selection-zone.svg",
  circleBrown: "/icons/circle-brown.svg",

  /** Landing — même picto que la nav dashboard “analyse de devis” */
  quoteAnalysis: "/icons/quote-analysis.svg",

  /** Barre latérale / header dashboard (états default + actif) */
  dashboardNav: {
    quoteAnalysis: "/icons/dashboard/nav/quote-analysis.svg",
    quoteAnalysisActive: "/icons/dashboard/nav/quote-analysis-active.svg",
    artisans: "/icons/dashboard/nav/artisans.svg",
    artisansActive: "/icons/dashboard/nav/artisans-active.svg",
    messages: "/icons/dashboard/nav/messages.svg",
    messagesActive: "/icons/dashboard/nav/messages-active.svg",
    articles: "/icons/dashboard/nav/articles.svg",
    articlesActive: "/icons/dashboard/nav/articles-active.svg",
    user: "/icons/dashboard/nav/user.svg",
  },

  /** Cartes artisan, filtres recherche */
  artisanCard: {
    moreMenu: "/icons/dashboard/artisan-card/more-menu.svg",
    verified: "/icons/dashboard/artisan-card/verified.svg",
    location: "/icons/dashboard/artisan-card/location.svg",
    clock: "/icons/dashboard/artisan-card/clock.svg",
    contact: "/icons/dashboard/artisan-card/contact.svg",
    search: "/icons/dashboard/artisan-card/search.svg",
    tune: "/icons/dashboard/artisan-card/tune.svg",
    filter: "/icons/dashboard/artisan-card/filter.svg",
    star: "/icons/dashboard/artisan-card/star.svg",
    select: "/icons/dashboard/artisan-card/select.svg",
  },
} as const;
