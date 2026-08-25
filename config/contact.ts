export const contactConfig = { phone: "", zaloUrl: "", facebookUrl: "", messengerUrl: "", tiktokUrl: "", email: "" };
export type ContactKey = keyof typeof contactConfig;
export const contactHref = (key: ContactKey) => key === "phone" ? (contactConfig.phone ? `tel:${contactConfig.phone.replace(/\s/g, "")}` : "") : contactConfig[key];
