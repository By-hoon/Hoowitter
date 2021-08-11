import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fBase";
import Hooweet from "components/Hooweet";
import HooweetFactory from "components/HooweetFactory";

const Home = ({ userObj }) => {
    const [hooweets, setHooweets] = useState([]);
    useEffect(() => {
        dbService.collection("hooweets").onSnapshot((snapshot) => {
            const hooweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setHooweets(hooweetArray);
        });
    }, []);
    return (
        <div className="container">
            <HooweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {hooweets.map((hooweet) => (
                    <Hooweet
                        key={hooweet.id}
                        hooweetObj={hooweet}
                        isOwner={hooweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;