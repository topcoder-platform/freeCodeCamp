import { challengeTypes } from '../../../../utils/challenge-types';
import { completedChallengesSelector } from '../../../redux/selectors';
import { ns } from './action-types';

export const currentTabSelector = state => state[ns].currentTab;
export const challengeFilesSelector = state => state[ns].challengeFiles;
export const challengeMetaSelector = state => state[ns].challengeMeta;
export const challengeTestsSelector = state => state[ns].challengeTests;
export const consoleOutputSelector = state => state[ns].consoleOut;
export const completedChallengesIds = state =>
  completedChallengesSelector(state).map(node => node.id);
export const isChallengeCompletedSelector = state => {
  const completedChallenges = completedChallengesSelector(state);
  const { id: currentChallengeId } = challengeMetaSelector(state);
  return completedChallenges.some(({ id }) => id === currentChallengeId);
};
export const isCodeLockedSelector = state => state[ns].isCodeLocked;
export const isCompletionModalOpenSelector = state =>
  state[ns].modal.completion;
export const isHelpModalOpenSelector = state => state[ns].modal.help;
export const isVideoModalOpenSelector = state => state[ns].modal.video;
export const isResetModalOpenSelector = state => state[ns].modal.reset;
export const isProjectPreviewModalOpenSelector = state =>
  state[ns].modal.projectPreview;
export const isShortcutsModalOpenSelector = state => state[ns].modal.shortcuts;
export const isResettingSelector = state => state[ns].isResetting;

export const isBuildEnabledSelector = state => state[ns].isBuildEnabled;
export const successMessageSelector = state => state[ns].successMessage;

export const projectFormValuesSelector = state =>
  state[ns].projectFormValues || {};

export const portalDocumentSelector = state => state[ns].portalDocument;

export const challengeDataSelector = state => {
  const { challengeType } = challengeMetaSelector(state);
  let challengeData = { challengeType };
  if (
    challengeType === challengeTypes.js ||
    challengeType === challengeTypes.jsProject
  ) {
    challengeData = {
      ...challengeData,
      challengeFiles: challengeFilesSelector(state)
    };
  } else if (challengeType === challengeTypes.backend) {
    const { solution: url = {} } = projectFormValuesSelector(state);
    challengeData = {
      ...challengeData,
      url
    };
  } else if (
    challengeType === challengeTypes.backEndProject ||
    challengeType === challengeTypes.pythonProject
  ) {
    const values = projectFormValuesSelector(state);
    const { solution: url } = values;
    challengeData = {
      ...challengeData,
      ...values,
      url
    };
  } else if (challengeType === challengeTypes.frontEndProject) {
    challengeData = {
      ...challengeData,
      ...projectFormValuesSelector(state)
    };
  } else if (
    challengeType === challengeTypes.html ||
    challengeType === challengeTypes.modern ||
    challengeType === challengeTypes.multifileCertProject
  ) {
    const { required = [], template = '' } = challengeMetaSelector(state);
    challengeData = {
      ...challengeData,
      challengeFiles: challengeFilesSelector(state),
      required,
      template
    };
  }
  return challengeData;
};

export const attemptsSelector = state => state[ns].attempts;
export const canFocusEditorSelector = state => state[ns].canFocusEditor;
export const visibleEditorsSelector = state => state[ns].visibleEditors;
export const testsRunningSelector = state => state[ns].testsRunning;
