const enum ErrorMessages {
  // Route Params
  INVALID_ID = 'The id must be a valid uuid',
  // Category
  CATEGORY_NOT_FOUND = 'The category was not found with the given id',
  PARENT_CATEGORY_NOT_FOUND = 'The parent category was not found with the given id',
  CATEGORY_ALREADY_EXISTS = 'A category already exists with the given slug',
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
  // Product Image
  PRODUCT_IMAGE_NOT_FOUND = 'The product image was not found with the given id',
  // Uploaded Image
  FILE_NOT_FOUND = 'The file was not found with the given id',
  // Shipping Method
  SHIPPING_METHOD_NOT_FOUND = 'The shipping method was not found with the given id',
  SHIPPING_METHOD_ALREADY_EXISTS = 'A shipping method already exists with the given name',
  // Variation
  VARIATION_NOT_FOUND = 'The product variation method was not found with the given id',
  VARIATION_ALREADY_EXISTS = 'A product variation already exists with the given properties',
  // Auth
  INVALID_USERNAME_OR_PASSWORD = 'The given username or password is invalid',
  INVALID_USER_CREDENTIALS = 'The given credentials are invalid',
  LOGIN_REQUIRED = 'To access this resource you must be logged in',
}

export default ErrorMessages;
