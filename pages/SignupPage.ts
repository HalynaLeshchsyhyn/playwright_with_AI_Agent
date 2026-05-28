import { Page, Locator } from '@playwright/test';

export class SignupPage {
  // All inputs use stable HTML IDs confirmed against live DOM
  private readonly titleMrRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly daySelect: Locator;
  private readonly monthSelect: Locator;
  private readonly yearSelect: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileInput: Locator;
  private readonly createAccountButton: Locator;
  private readonly enterAccountInfoHeading: Locator;
  // input[name="email"] — disabled attribute confirmed via DOM inspection
  private readonly emailField: Locator;
  // Server-side duplicate email error rendered as inline red paragraph
  private readonly duplicateEmailError: Locator;

  constructor(private readonly page: Page) {
    this.titleMrRadio           = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput          = page.locator('#password');
    this.daySelect              = page.locator('#days');
    this.monthSelect            = page.locator('#months');
    this.yearSelect             = page.locator('#years');
    this.firstNameInput         = page.locator('#first_name');
    this.lastNameInput          = page.locator('#last_name');
    this.addressInput           = page.locator('#address1');
    this.countrySelect          = page.locator('#country');
    this.stateInput             = page.locator('#state');
    this.cityInput              = page.locator('#city');
    this.zipcodeInput           = page.locator('#zipcode');
    this.mobileInput            = page.locator('#mobile_number');
    this.createAccountButton    = page.locator('[data-qa="create-account"]');
    this.enterAccountInfoHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.emailField             = page.locator('input[name="email"]');
    this.duplicateEmailError    = page.locator('p[style*="color: red"]');
  }

  // All params are optional so negative tests can omit the field under test.
  // Existing callers that pass all params are unaffected.
  async fillRegistrationForm(params: {
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zipcode?: string;
    mobileNumber?: string;
  } = {}): Promise<void> {
    await this.titleMrRadio.check();
    if (params.password     !== undefined) await this.passwordInput.fill(params.password);
    await this.daySelect.selectOption('15');
    await this.monthSelect.selectOption('June');
    await this.yearSelect.selectOption('1990');
    if (params.firstName    !== undefined) await this.firstNameInput.fill(params.firstName);
    if (params.lastName     !== undefined) await this.lastNameInput.fill(params.lastName);
    if (params.address      !== undefined) await this.addressInput.fill(params.address);
    await this.countrySelect.selectOption(params.country ?? 'United States');
    if (params.state        !== undefined) await this.stateInput.fill(params.state);
    if (params.city         !== undefined) await this.cityInput.fill(params.city);
    if (params.zipcode      !== undefined) await this.zipcodeInput.fill(params.zipcode);
    if (params.mobileNumber !== undefined) await this.mobileInput.fill(params.mobileNumber);
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }

  getEnterAccountInfoHeading(): Locator { return this.enterAccountInfoHeading; }
  getPasswordInput(): Locator           { return this.passwordInput; }
  getFirstNameInput(): Locator          { return this.firstNameInput; }
  getLastNameInput(): Locator           { return this.lastNameInput; }
  getAddressInput(): Locator            { return this.addressInput; }
  getStateInput(): Locator              { return this.stateInput; }
  getCityInput(): Locator               { return this.cityInput; }
  getZipcodeInput(): Locator            { return this.zipcodeInput; }
  getMobileInput(): Locator             { return this.mobileInput; }
  getEmailField(): Locator              { return this.emailField; }
  getDuplicateEmailError(): Locator     { return this.duplicateEmailError; }
}
