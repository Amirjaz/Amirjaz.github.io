// Real product images, shared by every design. Files live in public/images.

export const media = {
  /** Letterboxd Toolkit store images, 1280x800. The first is the main one. */
  letterboxd: [
    "/images/letterboxd-toolkit.webp",
    "/images/lb-score.webp",
    "/images/lb-cast.webp",
    "/images/lb-passport.webp",
    "/images/lb-year.webp",
  ],
  /** persian-ui docs images: 784x828 (inputs) and 784x1074 (picker), light backgrounds. */
  persianUi: ["/images/persian-ui-inputs.webp", "/images/persian-ui-picker.webp"],
  /** Shamsi-Calendar date picker, 344x462, in both themes. */
  shamsi: { light: "/images/shamsi-calendar.webp", dark: "/images/shamsi-calendar-dark.webp" },
} as const;
