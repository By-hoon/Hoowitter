import { dbService, storageService } from "fBase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="hooweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container hooweetEdit">
                        <input
                            type="text"
                            placeholder="Edit your hooweet"
                            value={newHooweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Hooweet" className="formBtn" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{hooweetObj.text}</h4>
                    {hooweetObj.attachmentUrl && <img src={hooweetObj.attachmentUrl} />}
                    {isOwner && (
                        <div class="hooweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Hooweet;