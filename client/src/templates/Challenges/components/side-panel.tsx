import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Test } from '../../../redux/prop-types';

import ExternalLink from '../../../assets/icons/link-external';
import { mathJaxScriptLoader } from '../../../utils/script-loaders';
import { challengeTestsSelector } from '../redux/selectors';
import TestSuite from './test-suite';
import ToolPanel from './tool-panel';

import './side-panel.css';

const currentYear = new Date().getFullYear();

const mapStateToProps = createSelector(
  challengeTestsSelector,
  (tests: Test[]) => ({
    tests
  })
);
interface SidePanelProps {
  block: string;
  challengeDescription: ReactElement;
  challengeTitle?: ReactElement;
  guideUrl: string;
  instructionsPanelRef: React.RefObject<HTMLDivElement>;
  showToolPanel: boolean;
  tests: Test[];
  testsRunning: boolean;
  videoUrl: string;
}

export function SidePanel({
  block,
  challengeDescription,
  challengeTitle,
  guideUrl,
  instructionsPanelRef,
  showToolPanel = false,
  tests,
  testsRunning,
  videoUrl
}: SidePanelProps): JSX.Element {
  const isChallengeComplete = tests.every(test => test.pass && !test.err);

  useEffect(() => {
    const MathJax = global.MathJax;
    const mathJaxMountPoint = document.querySelector('#mathjax');
    const mathJaxChallenge =
      block === 'rosetta-code' ||
      block === 'project-euler' ||
      block === 'intermediate-algorithm-scripting';
    if (MathJax) {
      // Configure MathJax when it's loaded and
      // users navigate from another challenge
      MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
          ],
          processEscapes: true,
          processClass:
            'rosetta-code|project-euler|intermediate-algorithm-scripting'
        }
      });
      MathJax.Hub.Queue([
        'Typeset',
        MathJax.Hub,
        document.querySelector('.intermediate-algorithm-scripting'),
        document.querySelector('.rosetta-code'),
        document.querySelector('.project-euler')
      ]);
    } else if (!mathJaxMountPoint && mathJaxChallenge) {
      mathJaxScriptLoader();
    }
  }, [block]);

  return (
    <div
      className='instructions-panel'
      ref={instructionsPanelRef}
      tabIndex={-1}
    >
      {challengeTitle}
      {challengeDescription}
      <div className='test-area-wrap'>
        {showToolPanel && tests.length > 10 && (
          <ToolPanel
            guideUrl={guideUrl}
            videoUrl={videoUrl}
            challengeIsCompleted={isChallengeComplete}
            isRunningTests={testsRunning}
          />
        )}
        <TestSuite tests={tests} />
        {showToolPanel && (
          <ToolPanel
            guideUrl={guideUrl}
            videoUrl={videoUrl}
            challengeIsCompleted={isChallengeComplete}
            isRunningTests={testsRunning}
          />
        )}
      </div>
      <div className='all-rights-link'>
        <a
          href='https://www.freecodecamp.org/'
          target='_blank'
          rel='noreferrer'
        >
          © {currentYear}, freeCodeCamp. All rights reserved.
          <ExternalLink />
        </a>
      </div>
    </div>
  );
}

SidePanel.displayName = 'SidePanel';

export default connect(mapStateToProps)(SidePanel);
