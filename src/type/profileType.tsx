export type SocialLink = {
  platform: string;
  url: string;
};

export type ProfileFormData = {
  fullName: string;
  accreditation: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  instagram: string;
  otherLinks: SocialLink[];
};

export const INITIAL_DATA: ProfileFormData = {
  fullName: "",
  accreditation: "",
  email: "",
  phone: "",
  whatsapp: "",
  telegram: "",
  facebook: "",
  instagram: "",
  otherLinks: [],
};




export type AgentProfile = {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    banner_url: string | null;
  } | null;

  profileInfo: {
    credentials: string | null;
    public_email: string | null;
    phone_number: string | null;
  } | null;

  socialLinks: {
    id: string;
    platform: string;
    url: string;
  }[];
};