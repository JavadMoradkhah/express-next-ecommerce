const enum ErrorMessages {
  // Route Params
  INVALID_ID = 'The id must be a valid uuid',
  // Category
  CATEGORY_NOT_FOUND = 'The category was not found with the given id',
  PARENT_CATEGORY_NOT_FOUND = 'The parent category was not found with the given id',
  CATEGORY_ALREADY_EXISTS = 'A category already exists with the given slug',
  // Brand
  BRAND_NOT_FOUND = 'The brand was not found with the given id',
  BRAND_ALREADY_EXISTS = 'A brand already exists with the given slug',
  // Tag
  TAG_NOT_FOUND = 'The tag was not found with the given id',
  TAG_ALREADY_EXISTS = 'A tag already exists with the given name or slug',
  // Product Tag
  PRODUCT_TAG_NOT_FOUND = 'The product tag was not found with the given id',
  PRODUCT_TAG_ALREADY_ADDED = 'The given tag has already been added to the specified product',
  // Faq category
  FAQ_CATEGORY_NOT_FOUND = 'The category was not found with the given id',
  FAQ_CATEGORY_ALREADY_EXISTS = 'A category already exists with the given name',
  // FAQ
  FAQ_NOT_FOUND = 'The faq was not found with the given id',
  FAQ_ALREADY_EXISTS = 'The faq already exists',
  // Color
  COLOR_NOT_FOUND = 'The color was not found with the given id',
  COLOR_ALREADY_EXISTS = 'A color already exists with the given name or code',
  // Size
  SIZE_NOT_FOUND = 'The size was not found with the given id',
  SIZE_ALREADY_EXISTS = 'A size already exists with the given value',
  // Country
  COUNTRY_NOT_FOUND = 'The country was not found with the given id',
  COUNTRY_ALREADY_EXISTS = 'A country already exists with the given name',
  // Product
  PRODUCT_NOT_FOUND = 'The product was not found with the given id',
  PRODUCT_IS_NOT_ORDERABLE = 'This product is not available right now, please try again later',
  PRODUCT_IS_NOT_ORDERABLE_ADMIN = 'This product is not orderable',
  // Product Image
  PRODUCT_IMAGE_NOT_FOUND = 'The product image was not found with the given id',
  // Review
  REVIEW_NOT_FOUND = 'The review was not found with the given id',
  REVIEW_ALREADY_EXISTS = 'You have already registered your review for this product',
  REVIEW_UPDATE_FORBIDDEN = "You can't change other people's reviews!",
  // Uploaded Image
  FILE_NOT_FOUND = 'The file was not found with the given id',
  FILE_TYPE_NOT_ALLOWED = 'The uploaded file type is not allowed',
  // Shipping Method
  SHIPPING_METHOD_NOT_FOUND = 'The shipping method was not found with the given id',
  SHIPPING_METHOD_ALREADY_EXISTS = 'A shipping method already exists with the given name',
  // Variation
  VARIATION_NOT_FOUND = 'The product variation was not found with the given id',
  VARIATION_ALREADY_EXISTS = 'A product variation already exists with the given properties',
  // Cart Item
  CART_ITEM_NOT_FOUND = 'The cart item was not found with the given id',
  QUANTITY_NOT_ALLOWED = 'The given quantity is more than the allowed quantity',
  // Address
  ADDRESS_NOT_FOUND = 'The address was not found with the given id',
  // Wishlist
  WISHLIST_ITEM_NOT_FOUND = 'The wishlist item was not found with the given id',
  // Auth
  INVALID_USERNAME_OR_PASSWORD = 'The given username or password is invalid',
  INVALID_EMAIL_OR_PASSWORD = 'The given email or password is invalid',
  INVALID_USER_CREDENTIALS = 'The given credentials are invalid',
  LOGIN_REQUIRED = 'To access this resource you must be logged in',
  EMAIL_CONFLICT = 'The given email has already been taken',
  EMAIL_VERIFICATION_EXPIRED = 'Sorry, it looks like your email confirmation link has expired. Please request a new one to continue.',
  INVALID_EMAIL_VERIFICATION_LINK = 'Sorry, we could not verify your account with the provided link. Please make sure you are using the correct link and try again. If you continue to have issues, please request a new email verification link.',
  SIGNUP_REQUIRED_FOR_EMAIL_VERIFICATION = 'You must sign up first in order to verify your email',
  EMAIL_VERIFICATION_REQUIRED = 'You must verify your email in order to log in',
  EMAIL_ALREADY_VERIFIED = 'Your email has already been verified',
  // Server Error
  UNEXPECTED_ERROR = 'An unexpected error occurred during processing the request',
  FORBIDDEN_RESOURCE = "You don't have permission to access this resource",
}

export default ErrorMessages;
