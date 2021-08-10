import React, { useState, useEffect } from "react";
import { dbService } from "fBase";
import Hooweet from "components/Hooweet"

const Home = ({ userObj }) => {
    const [hooweet, setHooweet] = useState("");
    const [hooweets, setHooweets] = useState([]);
    const getHooweets = async () => {
        const dbHooweets = await dbService.collection("hooweets").get();
        dbHooweets.forEach((document) => {
            const hooweetObject = {
                ...document.data(),
                id: document.id,
            };
            setHooweets((prev) => [hooweetObject, ...prev]);
        });
    }
    useEffect(() => {
        getHooweets();
        dbService.collection("hooweets").onSnapshot(snapshot => {
            const hooweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setHooweets(hooweetArray);
        });
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("hooweets").add({
            text: hooweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setHooweet("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setHooweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={hooweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="Hooweet" />
            </form>
            <div>
                {hooweets.map((hooweet) => (
                    <Hooweet key={hooweet.id}
                        hooweetObj={hooweet}
                        isOwner={hooweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;