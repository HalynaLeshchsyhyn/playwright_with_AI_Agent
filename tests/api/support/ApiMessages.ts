/** Centralised API response message constants — avoids magic strings in assertions. */
export const ApiMessages = {
  METHOD_NOT_SUPPORTED:   'This request method is not supported.',
  MISSING_SEARCH_PRODUCT: 'Bad request, search_product parameter is missing in POST request.',
  MISSING_LOGIN_PARAMS:   'Bad request, email or password parameter is missing in POST request.',
  USER_NOT_FOUND:         'User not found!',
  USER_EXISTS:            'User exists!',
  USER_CREATED:           'User created!',
  USER_UPDATED:           'User updated!',
  ACCOUNT_DELETED:        'Account deleted!',
} as const;
