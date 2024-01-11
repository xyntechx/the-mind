import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";

const Home: Component = () => {
    const navigate = useNavigate();
    const [roomID, setRoomID] = createSignal("");

    const createRoom = () => {
        setRoomID(crypto.randomUUID());
        localStorage.setItem("xynmindRoomID", roomID());
        localStorage.setItem("xynmindIsAdmin", "true");

        navigate(`/room/${roomID()}`);
    };

    const joinRoom = () => {
        navigate(`/room/${roomID()}`);
    };

    return (
        <>
            <h1 class="text-xl text-center font-bold mb-4">The Mind</h1>
            <div class="w-[400px] flex items-center justify-center flex-col gap-y-2">
                <button
                    onClick={() => createRoom()}
                    class="w-full text-center bg-white text-black border border-white rounded-md py-1 px-4 transition-colors hover:bg-black hover:text-white"
                >
                    Create Room
                </button>
                <p class="text-center">OR</p>
                <div class="w-full flex items-center justify-center flex-row">
                    <input
                        onInput={(e) => setRoomID(e.currentTarget.value)}
                        placeholder="Enter Room ID to join"
                        class="w-5/6 text-left border border-white rounded-s-md py-1 px-4 text-white bg-transparent outline-none"
                    />
                    <button
                        onClick={() => joinRoom()}
                        class="text-center bg-white text-black border border-white rounded-e-md py-1 px-4 transition-colors hover:bg-black hover:text-white"
                    >
                        Join
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
