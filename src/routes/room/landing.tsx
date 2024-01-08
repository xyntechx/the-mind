import { Show, type Component } from "solid-js";
import type { ReconnectingWebSocket } from "@solid-primitives/websocket";
import { IWSData } from "../../utils/types";

interface IProps {
    ws: ReconnectingWebSocket;
    roomID: string;
    isAdmin: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const Landing: Component<IProps> = ({ ws, roomID, isAdmin, setIsPlaying }) => {
    const handleStartPlay = () => {
        const data: IWSData = {
            id: "start",
            message: "",
        };

        ws.send(JSON.stringify(data));

        setIsPlaying(true);
    };

    ws.addEventListener("message", (ev) => {
        const data: IWSData = JSON.parse(ev.data);
        if (data.id === "start") setIsPlaying(true);
    });

    return (
        <>
            <Show
                when={isAdmin}
                fallback={
                    <p>
                        You have successfully joined the room with the following
                        ID
                    </p>
                }
            >
                <p>Your room has been created!</p>
                <p>
                    Share the following Room ID with your friends to start
                    playing.
                </p>
            </Show>
            <div class="border border-white rounded-md py-1 px-4 mt-4">
                <p>{roomID}</p>
            </div>
            <Show
                when={isAdmin}
                fallback={
                    <p class="italic mt-4">
                        Waiting for host to start the game...
                    </p>
                }
            >
                <button
                    onClick={() => handleStartPlay()}
                    class="bg-white text-black border border-white rounded-md py-1 px-4 mt-4 transition-colors hover:bg-black hover:text-white"
                >
                    Play
                </button>
            </Show>
        </>
    );
};

export default Landing;
