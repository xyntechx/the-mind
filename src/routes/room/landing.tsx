import { Show, type Component } from "solid-js";

interface IProps {
    roomID: string;
    isAdmin: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const Landing: Component<IProps> = ({ roomID, isAdmin, setIsPlaying }) => {
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
            <button
                onClick={() => setIsPlaying(true)}
                class="bg-white text-black border border-white rounded-md py-1 px-4 mt-4 transition-colors hover:bg-black hover:text-white"
            >
                Play
            </button>
        </>
    );
};

export default Landing;
