import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { getColor } from 'helpers/utils';
import classNames from 'classnames';
import { useAppContext } from 'Main';

const TinymceEditor = ({ value, handleChange, height = '50vh', isInvalid }) => {
  const {
    config: { isDark, isRTL }
  } = useAppContext();
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.dom.addStyle(`
        .mce-content-body {
          color: ${getColor('emphasis-color')} !important;
          background-color: ${getColor('tinymce-bg')} !important;
        }`);
    }
  }, [isDark]);

  return (
    <div className={classNames({ 'is-invalid': isInvalid })}>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleChange}
        apiKey={process.env.REACT_APP_TINYMCE_APIKEY}
        init={{
          height,
          menubar: false,
          content_style: `
            .mce-content-body {
              color: ${getColor('emphasis-color')};
              background-color: ${getColor('tinymce-bg')};
            }`,
          statusbar: false,
          plugins: 'link image lists table media directionality',
          toolbar:
            'styleselect | bold italic link bullist numlist image blockquote table media undo redo',

          directionality: isRTL ? 'rtl' : 'ltr',
          theme_advanced_toolbar_align: 'center'
        }}
      />
    </div>
  );
};

TinymceEditor.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  height: PropTypes.string,
  isInvalid: PropTypes.bool
};

export default TinymceEditor;
