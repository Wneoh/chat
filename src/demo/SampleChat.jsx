import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  i18next,
} from '@tencentcloud/chat-uikit-react';
import { TUILogin } from "@tencentcloud/tui-core";
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss';
import languageIcon from './assets/image/language.svg';
import { sampleResources } from '../locales/index';
import { genTestUserSig } from '../debug/GenerateTestUserSig';
import TencentCloudChat from '@tencentcloud/chat';
import { useParams,useNavigate } from 'react-router-dom';
import { Button } from "antd";

if (i18next.language === 'zh') {
  i18next.addResources(i18next.language, 'translation', sampleResources?.zh);
} else {
  i18next.addResources(i18next.language, 'translation', sampleResources?.en);
}

export default function SampleChat() {
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const { userId } = useParams();
  const [allow, setAllow] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLng, setCurrentLng] = useState({
    label: 'English',
    value: 'en'
  });
  const [isShowLngPop, setShowLngPop] = useState(false);


  const languageList = [
    {
      label: '简体中文',
      value: 'zh'
    },
    {
      label: 'English',
      value: 'en'
    }
  ]

  const handleHistoryClick = () => {
    navigate(`/history/${userId}`);
  };

  useEffect(() => {
    
    const init = async (userId) => {
      //const userID = `test-${Math.ceil(Math.random() * 10000)}`;
      const userID = userId;
      const allowLists = ['administrator','test-4584','test-8433','test-437','test-5746','test-7068','test-euro','test-euro1'];
      if (userID && allowLists.includes(userID)) {
  
        if (userID === "administrator") setIsAdmin(true);      
        const sdkAppId = genTestUserSig(userID).SDKAppID;
        const userSigId = genTestUserSig(userID).userSig;
        
        try {
          const loginInfo = {
            SDKAppID: sdkAppId,
            userID,
            userSig: userSigId,
            useUploadPlugin: true,
          };
          TUILogin.login(loginInfo);
          const { chat } = TUILogin.getContext();
          chat.on(TencentCloudChat.EVENT.SDK_READY, () => {
            console.log('data',TUILogin.EVENT.SDK_READY);
            setChat(chat);
            setAllow(true); 
          });
         
        } catch (error) {
          console.log(error);
          console.error('Login failed:', error);
        }
      }
    }

      init(userId);
  }, [userId,allow]);

  const changeLanguage = (lng) => {
    setCurrentLng(lng);
    i18next.changeLanguage(lng.value);
    setShowLngPop(!isShowLngPop);
  };

  return (
    <div className="sample-demo">
      {allow ? 
      <>
      <div className="chat-header">
        <div className="language-container">
          <div
            className="title-container"
            onClick={() => setShowLngPop(!isShowLngPop)}
          >
            <img className="language-icon" src={languageIcon} alt="" />
            <p className="language-text">{currentLng.label}</p>
          </div>
          {isShowLngPop && (
            <div className="language-item-container">
              {languageList.map((item, index) => {
                const key = `${item.value}${index}`;
                return (
                  <p
                    className="language-text"
                    role="menuitem"
                    tabIndex={index}
                    key={key}
                    onClick={() => {
                      changeLanguage(item);
                    }}
                  >
                    {item.label}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        {isAdmin && <>
      <Button type="primary" onClick={handleHistoryClick}>History</Button>
      </>}
      </div>
      <div className="chat-main">
        <div className="chat-demo">
          <TUIKit chat={chat} language={currentLng.value}></TUIKit>
        </div>
      </div>
    </> :
    <div>No userId provided or userId provided is not in whitelists</div>}
    </div>
  );
}
