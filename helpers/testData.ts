export const randomEmail = (): string =>
  `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;

export const randomString = (length = 8): string =>
  Math.random().toString(36).slice(2, 2 + length);

export const randomUser = () => ({
  name:     `User_${randomString(6)}`,
  email:    randomEmail(),
  password: `Pwd_${randomString(8)}!`,
});

export const randomReview = () => ({
  name:    `Reviewer_${randomString(5)}`,
  email:   randomEmail(),
  content: `Great product! ${randomString(12)}`,
});

export const randomAddress = () => ({
  firstName:   `First_${randomString(5)}`,
  lastName:    `Last_${randomString(5)}`,
  company:     `Company_${randomString(4)}`,
  address:     `${Math.floor(Math.random() * 999) + 1} Test Street`,
  state:       `State_${randomString(5)}`,
  city:        `City_${randomString(5)}`,
  zipcode:     `${Math.floor(Math.random() * 90000) + 10000}`,
  mobileNumber: `${Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000}`,
});
