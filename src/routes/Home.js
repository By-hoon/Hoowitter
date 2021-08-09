import React, { useState, useEffect } from "react";
import { dbService } from "fBase";

const Home = () => {
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
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("hooweets").add({
            hooweet,
            createdAt: Date.now(),
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
                    <div key={hooweet.id}>
                        <h4>{hooweet.Hooweet}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Home;