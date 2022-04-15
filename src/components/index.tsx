import React, { useCallback, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

const Root = styled.div`
  width: 400px;
  height: 240px;
`;

const Inner = styled.div`
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  height: 50px;
  align-items: center;

  label {
    flex-basis: 30%;
  }
`;

const Input = styled.input`
  width: 100%;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;

  > button:not(:first-child) {
    margin-left: 16px;
  }
`;

const Button = styled.button``;

const Index = () => {
  const commentRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const readOnlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.storage.local.get(['comment', 'nickname', 'imageUrl']).then((value) => {
      if (!commentRef.current || !nicknameRef.current || !imageUrlRef.current) return;

      const { comment, nickname, imageUrl } = value;
      commentRef.current.value = comment || '';
      nicknameRef.current.value = nickname || '';
      imageUrlRef.current.value = imageUrl || '';
    });
  }, []);

  const onSaveClick = useCallback(() => {
    if (!commentRef.current || !nicknameRef.current || !imageUrlRef.current || !readOnlyRef.current)
      return;

    const comment = commentRef.current.value;
    const nickname = nicknameRef.current.value;
    const imageUrl = imageUrlRef.current.value;

    // 保存
    chrome.storage.local.set({ comment, nickname, imageUrl }, () => {
      if (readOnlyRef.current) {
        readOnlyRef.current.innerText = 'データを保存しました';
      }
    });
  }, []);

  return (
    <Inner>
      <Row>
        <label>対象コメント</label>
        <Input ref={commentRef} type="text" />
      </Row>
      <Row>
        <label>ニックネーム</label>
        <Input ref={nicknameRef} type="text" />
      </Row>
      <Row>
        <label>画像URL</label>
        <Input ref={imageUrlRef} type="text" />
      </Row>
      <Row>
        <div ref={readOnlyRef} />
      </Row>
      <ButtonBox>
        <Button onClick={onSaveClick}>保存</Button>
      </ButtonBox>
    </Inner>
  );
};

render(
  <React.StrictMode>
    <Root>
      <Index />
    </Root>
  </React.StrictMode>,
  document.getElementById('root')
);
