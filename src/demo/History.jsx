import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { genTestUserSig } from '../debug/GenerateTestUserSig';
import { Button } from "antd";

function History() {
    const { userId } = useParams();
    const [isAdmin , setIsAdmin] = useState(false);

    const users = ['test-4584','test-8433','test-437','test-5746','test-7068','test-euro','test-euro1'];
    const [selectedUser, setSelectedUser] = useState(null);
    const [historyStats, setHistoryStats] = useState([]);
    const domain = "console.tim.qq.com";
    const sdkid = '1600034739';
    const fetchUsers = async (userId) => {
        console.log('userId',userId)
        const userSigId = genTestUserSig("administrator").userSig;
        console.log('userSigId',userSigId)
        const url = `https://${domain}/v4/openim/admin_getroammsg?sdkappid=${sdkid}&identifier=administrator&usersig=${userSigId}&random=99999999&contenttype=json`
        const body = {
            "Operator_Account":userId,
            "Peer_Account":"test-437",
            "MaxCnt":100,
            "MinTime": 1716192032,
            "MaxTime": 1716451232
        }
        
        const response = await axios.post(url,body);
        console.log(response);
        const {data} = response;
        const {MsgList} = data;
        setHistoryStats(MsgList);
    }
    
    useEffect(() => {
        if (userId === "administrator") {
            setIsAdmin(true);
        }
    }, [userId])
    
    const showHistory = (user) => {
        setSelectedUser(user);
        fetchUsers(user);
    }
    return (
        <>
        {isAdmin ?
            <>
                <div>History</div>
                <div>
                    {
                        users.map(user => (
                            <div>
                                <Button type="primary" onClick={() => showHistory(user)}>{user}</Button>
                            </div>
                        ))
                    }
                </div>
                {
                    selectedUser && historyStats.length &&
                    <div>
                        {historyStats.map(data => (
                            <>
                                <p> From : {data.From_Account} To : {data.To_Account}</p>
                            </>
                        ))
                    }
                    </div>
                }
                
            </>
            :
            <>
            <span>Not Admin</span>
            </>
        }
        </>
    )
}

export default History