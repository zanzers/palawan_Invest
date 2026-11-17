"use client";

import { FacebookLogoIcon, InstagramLogoIcon, WhatsappLogoIcon, TelegramLogoIcon, LinkSimpleIcon} from "@phosphor-icons/react";


export default function getSocialIcon(platform: string) {
  switch (platform.toLowerCase().trim()) {
    case "facebook":
    case "fb":
      return <FacebookLogoIcon size={22} weight="fill" />;

    case "instagram":
    case "ig":
      return <InstagramLogoIcon size={22} />;

    case "whatsapp":
      return <WhatsappLogoIcon size={22} />;

    case "telegram":
      return <TelegramLogoIcon size={22} />;

    default:
      return <LinkSimpleIcon size={22} />;
  }
}