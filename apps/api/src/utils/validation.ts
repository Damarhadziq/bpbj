type RecordBody = Record<string, unknown>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type NewsPayload = {
  title: string;
  slug: string;
  category: string;
  content: string;
  imageUrl: string;
  isFeatured: boolean;
  isSelected: boolean;
  date: Date;
};

export type GalleryPayload = {
  title: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  galleryImages: GalleryImagePayload[];
  isFeatured: boolean;
  date: Date;
};

export type GalleryImagePayload = {
  imageUrl: string;
  imageAlt?: string;
  isCover: boolean;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type ContactReplyPayload = {
  replySubject: string;
  replyMessage: string;
};

export type CarouselPayload = {
  imageUrl: string;
  imageAlt?: string;
  displayOrder: number;
  isActive: boolean;
};

export type ServiceLinkPayload = {
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
};

export type RegulationPayload = {
  title: string;
  category: string;
  description: string;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

export type EmployeePayload = {
  name: string;
  position: string;
  quote: string | null;
  imageUrl: string | null;
  imageAlt?: string;
  displayOrder: number;
  isActive: boolean;
};

export type WelcomePayload = {
  name: string;
  position: string;
  message: string;
  imageUrl?: string;
};

export type UserCreatePayload = {
  name: string;
  email: string;
  password: string;
};

export type OwnProfilePayload = {
  name: string;
  image?: string;
};

export type OwnPasswordPayload = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type AdminPasswordPayload = {
  password: string;
  confirmPassword: string;
  confirmationText: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxImageLength = 10 * 1024 * 1024;
const maxEmployeeQuoteWords = 20;
const externalUrlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
export const NEWS_CATEGORIES = ['Informasi', 'Kegiatan', 'Layanan', 'Sosialisasi', 'Market Sounding'] as const;

const normalizeCategory = (category = '') => category.trim().toLowerCase();
const newsCategoryAliases: Record<string, typeof NEWS_CATEGORIES[number]> = {
  informasi: 'Informasi',
  pengumuman: 'Informasi',
  kegiatan: 'Kegiatan',
  layanan: 'Layanan',
  sosialisasi: 'Sosialisasi',
  tender: 'Sosialisasi',
  'market sounding': 'Market Sounding',
};

const invalid = <T>(error: string): ValidationResult<T> => ({ ok: false, error });
const valid = <T>(data: T): ValidationResult<T> => ({ ok: true, data });

const getBody = (input: unknown): ValidationResult<RecordBody> => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return invalid('Request body must be an object');
  }
  return valid(input as RecordBody);
};

const requiredString = (body: RecordBody, field: string, maxLength: number): ValidationResult<string> => {
  const value = body[field];
  if (typeof value !== 'string' || !value.trim()) {
    return invalid(`${field} is required`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return invalid(`${field} must be ${maxLength} characters or fewer`);
  }

  return valid(trimmed);
};

const optionalString = (body: RecordBody, field: string, maxLength: number): ValidationResult<string | undefined> => {
  const value = body[field];
  if (value === undefined || value === null || value === '') return valid(undefined);
  if (typeof value !== 'string') return invalid(`${field} must be a string`);

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return invalid(`${field} must be ${maxLength} characters or fewer`);
  }

  return valid(trimmed || undefined);
};

const requiredDate = (body: RecordBody, field: string): ValidationResult<Date> => {
  const value = body[field];
  if (typeof value !== 'string' && typeof value !== 'number') {
    return invalid(`${field} is required`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return invalid(`${field} must be a valid date`);
  }

  return valid(date);
};

const optionalBoolean = (body: RecordBody, field: string, defaultValue: boolean): ValidationResult<boolean> => {
  const value = body[field];
  if (value === undefined || value === null) return valid(defaultValue);
  if (typeof value !== 'boolean') return invalid(`${field} must be a boolean`);
  return valid(value);
};

const integerField = (body: RecordBody, field: string, defaultValue: number): ValidationResult<number> => {
  const value = body[field];
  if (value === undefined || value === null || value === '') return valid(defaultValue);

  const numberValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(numberValue) || numberValue < -10000 || numberValue > 10000) {
    return invalid(`${field} must be an integer between -10000 and 10000`);
  }

  return valid(numberValue);
};

const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

export const normalizeNewsCategory = (category: string): ValidationResult<string> => {
  const normalized = newsCategoryAliases[normalizeCategory(category)];
  if (!normalized) {
    return invalid(`category must be one of: ${NEWS_CATEGORIES.join(', ')}`);
  }
  return valid(normalized);
};

export const validateUuid = (value: unknown, field = 'id'): ValidationResult<string> => {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    return invalid(`${field} must be a valid UUID`);
  }
  return valid(value);
};

export const validateTextId = (value: unknown, field = 'id'): ValidationResult<string> => {
  if (typeof value !== 'string' || !value.trim() || value.length > 255) {
    return invalid(`${field} is invalid`);
  }
  return valid(value);
};

export const validateNewsPayload = (input: unknown): ValidationResult<NewsPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const title = requiredString(body.data, 'title', 255);
  if (!title.ok) return title;
  const slug = requiredString(body.data, 'slug', 255);
  if (!slug.ok) return slug;
  if (!slugPattern.test(slug.data)) return invalid('slug must contain lowercase letters, numbers, and hyphens only');
  const category = requiredString(body.data, 'category', 50);
  if (!category.ok) return category;
  const normalizedCategory = normalizeNewsCategory(category.data);
  if (!normalizedCategory.ok) return normalizedCategory;
  const content = requiredString(body.data, 'content', 20000);
  if (!content.ok) return content;
  const imageUrl = requiredString(body.data, 'imageUrl', maxImageLength);
  if (!imageUrl.ok) return imageUrl;
  const isFeatured = optionalBoolean(body.data, 'isFeatured', false);
  if (!isFeatured.ok) return isFeatured;
  const isSelected = optionalBoolean(body.data, 'isSelected', false);
  if (!isSelected.ok) return isSelected;
  const date = requiredDate(body.data, 'date');
  if (!date.ok) return date;

  return valid({ title: title.data, slug: slug.data, category: normalizedCategory.data, content: content.data, imageUrl: imageUrl.data, isFeatured: isFeatured.data, isSelected: isSelected.data, date: date.data });
};

export const validateGalleryPayload = (input: unknown): ValidationResult<GalleryPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const title = requiredString(body.data, 'title', 255);
  if (!title.ok) return title;
  const category = requiredString(body.data, 'category', 50);
  if (!category.ok) return category;
  const location = requiredString(body.data, 'location', 255);
  if (!location.ok) return location;
  const description = requiredString(body.data, 'description', 10000);
  if (!description.ok) return description;
  const galleryImages = validateGalleryImages(body.data);
  if (!galleryImages.ok) return galleryImages;
  const isFeatured = optionalBoolean(body.data, 'isFeatured', false);
  if (!isFeatured.ok) return isFeatured;
  const date = requiredDate(body.data, 'date');
  if (!date.ok) return date;
  const coverImage = galleryImages.data.find((image) => image.isCover) || galleryImages.data[0];

  return valid({
    title: title.data,
    category: category.data,
    location: location.data,
    description: description.data,
    imageUrl: coverImage.imageUrl,
    imageAlt: coverImage.imageAlt || title.data,
    galleryImages: galleryImages.data,
    isFeatured: isFeatured.data,
    date: date.data,
  });
};

const validateGalleryImages = (body: RecordBody): ValidationResult<GalleryImagePayload[]> => {
  const rawImages = body.galleryImages;
  const legacyImageUrl = body.imageUrl;
  const legacyImageAlt = body.imageAlt;

  const sourceImages = Array.isArray(rawImages)
    ? rawImages
    : legacyImageUrl
      ? [{ imageUrl: legacyImageUrl, imageAlt: legacyImageAlt, isCover: true }]
      : [];

  if (sourceImages.length === 0) return invalid('At least one gallery image is required');
  if (sourceImages.length > 20) return invalid('A gallery can contain up to 20 images');

  const parsed = sourceImages.map((image, index) => {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      return invalid<GalleryImagePayload>(`galleryImages[${index}] must be an object`);
    }

    const record = image as RecordBody;
    const imageUrl = record.imageUrl;
    const imageAlt = record.imageAlt;

    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return invalid<GalleryImagePayload>(`galleryImages[${index}].imageUrl is required`);
    }
    if (imageUrl.length > maxImageLength) {
      return invalid<GalleryImagePayload>(`galleryImages[${index}].imageUrl is too large`);
    }
    if (imageAlt !== undefined && imageAlt !== null && typeof imageAlt !== 'string') {
      return invalid<GalleryImagePayload>(`galleryImages[${index}].imageAlt must be a string`);
    }
    if (typeof imageAlt === 'string' && imageAlt.length > 255) {
      return invalid<GalleryImagePayload>(`galleryImages[${index}].imageAlt must be 255 characters or fewer`);
    }

    return valid({
      imageUrl: imageUrl.trim(),
      imageAlt: typeof imageAlt === 'string' && imageAlt.trim() ? imageAlt.trim() : undefined,
      isCover: record.isCover === true,
    });
  });

  const invalidImage = parsed.find((image) => !image.ok);
  if (invalidImage && !invalidImage.ok) return invalid(invalidImage.error);

  let images = parsed.map((image) => (image as { ok: true; data: GalleryImagePayload }).data);
  const coverIndex = images.findIndex((image) => image.isCover);

  images = images.map((image, index) => ({
    ...image,
    isCover: images.length === 1 ? true : index === (coverIndex >= 0 ? coverIndex : 0),
  }));

  return valid(images);
};

export const validateContactPayload = (input: unknown): ValidationResult<ContactPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const name = requiredString(body.data, 'name', 255);
  if (!name.ok) return name;
  const email = requiredString(body.data, 'email', 255);
  if (!email.ok) return email;
  if (!emailPattern.test(email.data)) return invalid('email must be valid');
  const subject = optionalString(body.data, 'subject', 255);
  if (!subject.ok) return subject;
  const message = requiredString(body.data, 'message', 10000);
  if (!message.ok) return message;

  return valid({ name: name.data, email: email.data, subject: subject.data, message: message.data });
};

export const validateContactStatus = (input: unknown): ValidationResult<'UNREAD' | 'READ' | 'REPLIED'> => {
  const body = getBody(input);
  if (!body.ok) return body;
  const { status } = body.data;
  if (status !== 'UNREAD' && status !== 'READ' && status !== 'REPLIED') return invalid('Invalid status');
  return valid(status);
};

export const validateContactReplyPayload = (input: unknown): ValidationResult<ContactReplyPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const replySubject = requiredString(body.data, 'replySubject', 255);
  if (!replySubject.ok) return replySubject;
  const replyMessage = requiredString(body.data, 'replyMessage', 10000);
  if (!replyMessage.ok) return replyMessage;

  return valid({ replySubject: replySubject.data, replyMessage: replyMessage.data });
};

export const validateConfirmationText = (input: unknown): ValidationResult<string> => {
  const body = getBody(input);
  if (!body.ok) return body;
  const confirmationText = optionalString(body.data, 'confirmationText', 255);
  if (!confirmationText.ok) return confirmationText;
  return valid(confirmationText.data || '');
};

export const validateAnalyticsVisit = (input: unknown): ValidationResult<{ device: 'desktop' | 'mobile' | 'tablet'; visitorType: 'new' | 'returning' }> => {
  const body = getBody(input);
  if (!body.ok) return body;
  const { device, visitorType } = body.data;

  if (device !== 'desktop' && device !== 'mobile' && device !== 'tablet') return invalid('device must be desktop, mobile, or tablet');
  if (visitorType !== 'new' && visitorType !== 'returning') return invalid('visitorType must be new or returning');

  return valid({ device, visitorType });
};

export const validateCarouselPayload = (input: unknown): ValidationResult<CarouselPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const imageUrl = requiredString(body.data, 'imageUrl', maxImageLength);
  if (!imageUrl.ok) return imageUrl;
  const imageAlt = optionalString(body.data, 'imageAlt', 255);
  if (!imageAlt.ok) return imageAlt;
  const displayOrder = integerField(body.data, 'displayOrder', 0);
  if (!displayOrder.ok) return displayOrder;
  const isActive = optionalBoolean(body.data, 'isActive', true);
  if (!isActive.ok) return isActive;

  return valid({ imageUrl: imageUrl.data, imageAlt: imageAlt.data, displayOrder: displayOrder.data, isActive: isActive.data });
};

export const validateServiceLinkPayload = (input: unknown): ValidationResult<ServiceLinkPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const imageUrl = requiredString(body.data, 'imageUrl', maxImageLength);
  if (!imageUrl.ok) return imageUrl;
  const linkUrl = requiredString(body.data, 'linkUrl', 2048);
  if (!linkUrl.ok) return linkUrl;
  if (!externalUrlPattern.test(linkUrl.data)) return invalid('linkUrl must be a valid http or https URL');
  const displayOrder = integerField(body.data, 'displayOrder', 0);
  if (!displayOrder.ok) return displayOrder;

  return valid({ imageUrl: imageUrl.data, linkUrl: linkUrl.data, displayOrder: displayOrder.data });
};

export const validateRegulationPayload = (input: unknown): ValidationResult<RegulationPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const title = requiredString(body.data, 'title', 255);
  if (!title.ok) return title;
  const category = requiredString(body.data, 'category', 100);
  if (!category.ok) return category;
  const description = requiredString(body.data, 'description', 2000);
  if (!description.ok) return description;
  const linkUrl = optionalString(body.data, 'linkUrl', 2048);
  if (!linkUrl.ok) return linkUrl;
  if (linkUrl.data && !externalUrlPattern.test(linkUrl.data)) {
    return invalid('linkUrl must be a valid http or https URL');
  }
  const displayOrder = integerField(body.data, 'displayOrder', 0);
  if (!displayOrder.ok) return displayOrder;
  const isActive = optionalBoolean(body.data, 'isActive', true);
  if (!isActive.ok) return isActive;

  return valid({
    title: title.data,
    category: category.data,
    description: description.data,
    linkUrl: linkUrl.data || null,
    displayOrder: displayOrder.data,
    isActive: isActive.data,
  });
};

export const validateEmployeePayload = (input: unknown): ValidationResult<EmployeePayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const name = requiredString(body.data, 'name', 255);
  if (!name.ok) return name;
  const position = requiredString(body.data, 'position', 255);
  if (!position.ok) return position;
  const quote = optionalString(body.data, 'quote', 180);
  if (!quote.ok) return quote;
  if (quote.data && wordCount(quote.data) > maxEmployeeQuoteWords) {
    return invalid(`quote must be ${maxEmployeeQuoteWords} words or fewer`);
  }
  const imageUrl = optionalString(body.data, 'imageUrl', maxImageLength);
  if (!imageUrl.ok) return imageUrl;
  const imageAlt = optionalString(body.data, 'imageAlt', 255);
  if (!imageAlt.ok) return imageAlt;
  const displayOrder = integerField(body.data, 'displayOrder', 0);
  if (!displayOrder.ok) return displayOrder;
  const isActive = optionalBoolean(body.data, 'isActive', true);
  if (!isActive.ok) return isActive;

  return valid({
    name: name.data,
    position: position.data,
    quote: quote.data || null,
    imageUrl: imageUrl.data || null,
    imageAlt: imageAlt.data,
    displayOrder: displayOrder.data,
    isActive: isActive.data,
  });
};

export const validateWelcomePayload = (input: unknown): ValidationResult<WelcomePayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const name = requiredString(body.data, 'name', 255);
  if (!name.ok) return name;
  const position = requiredString(body.data, 'position', 255);
  if (!position.ok) return position;
  const message = requiredString(body.data, 'message', 10000);
  if (!message.ok) return message;
  const imageUrl = optionalString(body.data, 'imageUrl', maxImageLength);
  if (!imageUrl.ok) return imageUrl;

  return valid({ name: name.data, position: position.data, message: message.data, imageUrl: imageUrl.data });
};

export const validateUserCreatePayload = (input: unknown): ValidationResult<UserCreatePayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const name = requiredString(body.data, 'name', 255);
  if (!name.ok) return name;
  const email = requiredString(body.data, 'email', 255);
  if (!email.ok) return email;
  if (!emailPattern.test(email.data)) return invalid('email must be valid');
  const password = requiredString(body.data, 'password', 1024);
  if (!password.ok) return password;
  if (password.data.length < 8) return invalid('Password must be at least 8 characters');

  return valid({ name: name.data, email: email.data.toLowerCase(), password: password.data });
};

export const validateOwnProfilePayload = (input: unknown): ValidationResult<OwnProfilePayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const name = requiredString(body.data, 'name', 255);
  if (!name.ok) return name;
  const image = optionalString(body.data, 'image', maxImageLength);
  if (!image.ok) return image;

  return valid({ name: name.data, image: image.data });
};

export const validateRole = (input: unknown): ValidationResult<'admin' | 'superadmin'> => {
  const body = getBody(input);
  if (!body.ok) return body;
  const { role } = body.data;
  if (role !== 'admin' && role !== 'superadmin') return invalid('Invalid role');
  return valid(role);
};

export const validateOwnPasswordPayload = (input: unknown): ValidationResult<OwnPasswordPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const currentPassword = requiredString(body.data, 'currentPassword', 1024);
  if (!currentPassword.ok) return currentPassword;
  const password = requiredString(body.data, 'password', 1024);
  if (!password.ok) return password;
  const confirmPassword = requiredString(body.data, 'confirmPassword', 1024);
  if (!confirmPassword.ok) return confirmPassword;

  if (password.data !== confirmPassword.data) return invalid('Password confirmation does not match');
  if (password.data.length < 8) return invalid('Password must be at least 8 characters');
  if (currentPassword.data === password.data) return invalid('New password must be different from current password');

  return valid({ currentPassword: currentPassword.data, password: password.data, confirmPassword: confirmPassword.data });
};

export const validateAdminPasswordPayload = (input: unknown): ValidationResult<AdminPasswordPayload> => {
  const body = getBody(input);
  if (!body.ok) return body;

  const password = requiredString(body.data, 'password', 1024);
  if (!password.ok) return password;
  const confirmPassword = requiredString(body.data, 'confirmPassword', 1024);
  if (!confirmPassword.ok) return confirmPassword;
  const confirmationText = requiredString(body.data, 'confirmationText', 255);
  if (!confirmationText.ok) return confirmationText;

  if (password.data !== confirmPassword.data) return invalid('Password confirmation does not match');
  if (password.data.length < 8) return invalid('Password must be at least 8 characters');

  return valid({ password: password.data, confirmPassword: confirmPassword.data, confirmationText: confirmationText.data });
};
