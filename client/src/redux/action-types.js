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
    'updateFailed',
    'updateDonationFormState',
    'updateUserToken',
    'postChargeProcessing',
    'updateAllChallengesInfo',
    ...createAsyncTypes('fetchUser'),
    ...createAsyncTypes('postCharge'),
    ...createAsyncTypes('fetchProfileForUser'),
    ...createAsyncTypes('acceptTerms'),
    ...createAsyncTypes('showCert'),
    ...createAsyncTypes('reportUser'),
    ...createAsyncTypes('deleteUserToken'),
    ...createAsyncTypes('saveChallenge')
  ],
  ns
);
