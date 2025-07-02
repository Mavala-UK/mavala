import type {I18nBase} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

export type Sites = {
  isMavalaFrance: boolean;
  isMavalaCorporate: boolean;
};

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type YotpoReviewResponse = {
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
  bottomline: {
    total_review: number;
    average_score: number;
    star_distribution: Record<string, number>;
    custom_fields_bottomline: any | null;
  };
  products: {
    id: number;
    domain_key: string;
    name: string;
    social_links: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      google_oauth2?: string;
    };
    embedded_widget_link: string;
    testimonials_product_link: string;
    product_link: string;
  }[];
  product_tag: any[];
  reviews: YotpoReview[];
  comment?: YotpoComment;
};

export type YotpoReview = {
  id: number;
  score: number;
  votes_up: number;
  votes_down: number;
  content: string;
  title: string;
  sentiment: number;
  created_at: string;
  verified_buyer: boolean;
  source_review_id: number | null;
  custom_fields: any | null;
  product_id: number;
  is_incentivized: boolean;
  incentive_type?: string;
  images_data?: ReviewImage[];
  user: YotpoUser;
};

export type YotpoUser = {
  user_id: number;
  display_name: string;
  social_image: string;
  user_type: string;
  is_social_connected: number;
};

export type ReviewImage = {
  id: number;
  thumb_url: string;
  original_url: string;
};

export type YotpoComment = {
  id: number;
  content: string;
  created_at: string;
  comments_avatar: string | null;
};
