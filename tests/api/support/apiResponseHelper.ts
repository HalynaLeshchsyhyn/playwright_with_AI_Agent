import { APIResponse } from '@playwright/test';
import { Logger } from '../../../helpers/logger';

/**
 * Parses the JSON body from an API response and logs debug information.
 * Assertions remain in test files — this helper only handles parsing and logging.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseApiResponse(response: APIResponse): Promise<any> {
  Logger.debug(`HTTP status: ${response.status()}`);
  const body = await response.json();
  Logger.debug(`Response code: ${body.responseCode}, message: ${body.message ?? '—'}`);
  return body;
}
