import { randomUser, randomAddress } from '../../../helpers/testData';
import { AccountFormData } from './types';

/** Builds an AccountFormData payload from a randomUser + randomAddress pair. */
export function buildAccountForm(
  user:    ReturnType<typeof randomUser>,
  address: ReturnType<typeof randomAddress>,
): AccountFormData {
  return {
    name:          user.name,
    email:         user.email,
    password:      user.password,
    title:         'Mr',
    birth_date:    '15',
    birth_month:   '6',
    birth_year:    '1990',
    firstname:     address.firstName,
    lastname:      address.lastName,
    company:       address.company,
    address1:      address.address,
    address2:      '',
    country:       'United States',
    zipcode:       address.zipcode,
    state:         address.state,
    city:          address.city,
    mobile_number: address.mobileNumber,
  };
}
