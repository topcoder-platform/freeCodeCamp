export enum PostMessageIframeEvents {
  NavigationLastChallenge = 'fcc:nav:last-challenge',
  ChallengeCompleted = 'fcc:challenge:completed',
  ChallengeReady = 'fcc:challenge:ready',
  IncomingUrlUpdate = 'fcc:url:update'
}

export const postNavigationLastChallengeEvent = (data: unknown) =>
  iframeMessage(PostMessageIframeEvents.NavigationLastChallenge, data);

export const postChallengeCompletedEvent = (data: unknown) =>
  iframeMessage(PostMessageIframeEvents.ChallengeCompleted, data);

export const postChallengeReadyEvent = (data: unknown) =>
  iframeMessage(PostMessageIframeEvents.ChallengeReady, data);

export const iframeMessage = (eventName: string, data: unknown) => {
  parent.postMessage(
    JSON.stringify({
      event: eventName,
      data
    }),
    '*'
  );
};
