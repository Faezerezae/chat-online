import React from 'react';
import { Button } from 'react-bootstrap';
import PageHeader from 'components/common/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconComponentCard from 'components/common/FalconComponentCard';
import Picker from '@emoji-mart/react';
import { getColor } from 'helpers/utils';
import { useAppContext } from 'Main';

const emojiMart = `
  function EmojiMart () {
    const [previewEmoji, setPreviewEmoji] = useState(false);
    const {
      config: { isDark }
    } = useAppContext();
    const [message, setMessage] = useState('');

    const addEmoji = e => {
      let emoji = e.native;
      setMessage(message + emoji);
    };

    return (
      <div className="position-relative">
        <Button variant="info" onClick={() => setPreviewEmoji(!previewEmoji)}>
          <FontAwesomeIcon
            icon={['far', 'laugh-beam']}
            transform=""
          />
        </Button>

        {previewEmoji && (
          <Picker
            set="google"
            onEmojiSelect={addEmoji}
            theme={isDark ? 'dark' : 'light'}
            previewPosition="none"
            skinTonePosition="none"
          />
        )}
      </div>
    );
  }
`;

const EmojiMartExample = () => (
  <>
    <PageHeader
      title="Emoji Button"
      description="Emoji Mart is a Slack-like customizable emoji picker component for React"
      className="mb-3"
    >
      <Button
        href="https://github.com/missive/emoji-mart"
        target="_blank"
        variant="link"
        size="sm"
        className="ps-0"
      >
        Documentation for Emoji Button
        <FontAwesomeIcon icon="chevron-right" className="ms-1 fs--2" />
      </Button>
    </PageHeader>

    <FalconComponentCard noGuttersBottom>
      <FalconComponentCard.Header title="Example" />
      <FalconComponentCard.Body
        code={emojiMart}
        scope={{ getColor, Picker, useAppContext, FontAwesomeIcon }}
        language="jsx"
      />
    </FalconComponentCard>
  </>
);

export default EmojiMartExample;
