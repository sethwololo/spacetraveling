import { useEffect, useRef } from 'react';

export function Comments(): JSX.Element {
  const commentsDiv = useRef<HTMLDivElement>();

  useEffect(() => {
    if (commentsDiv) {
      const commentsScript = document.createElement('script');

      commentsScript.setAttribute('src', 'https://utteranc.es/client.js');
      commentsScript.setAttribute('crossorigin', 'anonymous');
      commentsScript.setAttribute('async', 'true');
      commentsScript.setAttribute(
        'repo',
        'sethwololo-ignite/spacetraveling-comments'
      );
      commentsScript.setAttribute('issue-term', 'pathname');
      commentsScript.setAttribute('theme', 'photon-dark');
      commentsDiv.current.appendChild(commentsScript);
    }
  }, []);

  return <section ref={commentsDiv} />;
}
