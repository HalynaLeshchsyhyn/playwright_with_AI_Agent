import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { NavBar } from '../../pages/components/NavBar';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { AccountCreatedPage } from '../../pages/AccountCreatedPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { OrderConfirmedPage } from '../../pages/OrderConfirmedPage';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';

type EcomFixtures = {
  homePage: HomePage;
  navBar: NavBar;
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  orderConfirmedPage: OrderConfirmedPage;
  deleteAccountPage: DeleteAccountPage;
};

export const test = base.extend<EcomFixtures>({
  homePage:           async ({ page }, use) => use(new HomePage(page)),
  navBar:             async ({ page }, use) => use(new NavBar(page)),
  loginPage:          async ({ page }, use) => use(new LoginPage(page)),
  signupPage:         async ({ page }, use) => use(new SignupPage(page)),
  accountCreatedPage: async ({ page }, use) => use(new AccountCreatedPage(page)),
  productsPage:       async ({ page }, use) => use(new ProductsPage(page)),
  productDetailsPage: async ({ page }, use) => use(new ProductDetailsPage(page)),
  cartPage:           async ({ page }, use) => use(new CartPage(page)),
  checkoutPage:       async ({ page }, use) => use(new CheckoutPage(page)),
  paymentPage:        async ({ page }, use) => use(new PaymentPage(page)),
  orderConfirmedPage: async ({ page }, use) => use(new OrderConfirmedPage(page)),
  deleteAccountPage:  async ({ page }, use) => use(new DeleteAccountPage(page)),
});

export { expect } from '@playwright/test';
