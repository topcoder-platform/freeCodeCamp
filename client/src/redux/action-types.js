import { createTypes, createAsyncTypes } from '../utils/create-types';

export const ns = 'app';

export const actionTypes = createTypes(
  [
    'appMount',
    'allowBlockDonationRequests',
    'hardGoTo',
    'hideCodeAlly',
    'preventBlockDonationRequests',
    'preventProgressDonationRequests',
    'tryToShowDonationModal',
    'openDonationModal',
    'closeDonationModal',
    'openSignoutModal',
    'closeSignoutModal',
    'onlineStatusChange',
    'serverStatusChange',
    'resetUserData',
    'tryToShowCodeAlly',
    'executeGA',
    'showCodeAlly',
    'submitComplete',
    'updateComplete',
    'updateCurrentChallengeId',
    'updateFailed',
    'updateDonationFormState',
    'updateUserToken',
    ...createAsyncTypes('fetchUser'),
    ...createAsyncTypes('addDonation'),
    ...createAsyncTypes('createStripeSession'),
    ...createAsyncTypes('postChargeStripe'),
    ...createAsyncTypes('fetchProfileForUser'),
    ...createAsyncTypes('acceptTerms'),
    ...createAsyncTypes('showCert'),
    ...createAsyncTypes('reportUser'),
    ...createAsyncTypes('postChargeStripeCard'),
    ...createAsyncTypes('deleteUserToken'),
    ...createAsyncTypes('saveChallenge')
  ],
  ns
);
