import { dbService, storageService } from "fBase";
import React, { useState } from "react";

const Hooweet = ({ hooweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newHooweet, setNewHooweet] = useState(hooweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this hooweet?");
        if (ok) {
            await dbService.doc(`hooweets/${hooweetObj.id}`).delete();
            await storageService.refFromURL(hooweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`hooweets/${hooweetObj.id}`).update({
            text: newHooweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewHooweet(value);
    };
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your hooweet"
                            value={newHooweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Hooweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{hooweetObj.text}</h4>
                    {hooweetObj.attachmentUrl && (
                        <img src={hooweetObj.attachmentUrl} width="50px" height="50px" />
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Hooweet</button>
                            <button onClick={toggleEditing}>Edit Hooweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Hooweet;