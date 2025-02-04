import { createTypes } from '../../../utils/create-types';

export const CURRENT_CHALLENGE_KEY = 'currentChallengeId';

export const ns = 'challenge';

export const actionTypes = createTypes(
  [
    'createFiles',
    'createQuestion',
    'initTests',
    'initConsole',
    'initLogs',
    'updateConsole',
    'updateChallengeMeta',
    'updateFile',
    'updateJSEnabled',
    'updateSolutionFormValues',
    'updateSuccessMessage',
    'updateTests',
    'updateLogs',
    'cancelTests',
    'updateTestsRunning',

    'logsToConsole',

    'lockCode',
    'unlockCode',
    'disableBuildOnError',
    'storedCodeFound',
    'noStoredCodeFound',
    'saveEditorContent',

    'closeModal',
    'openModal',

    'previewMounted',
    'projectPreviewMounted',
    'storePortalDocument',
    'removePortalDocument',
    'challengeMounted',
    'checkChallenge',
    'executeChallenge',
    'resetChallenge',
    'stopResetting',
    'submitChallenge',
    'resetAttempts',

    'setEditorFocusability',
    'toggleVisibleEditor'
  ],
  ns
);
