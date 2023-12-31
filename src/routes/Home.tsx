import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Home: Component = () => {
    return (
        <>
            <h1>The Mind</h1>
            {/* // TODO: Create room button + page (generate room ID, can share link with friends) */}

            {/* Temp button */}
            <A
                href="/room/123"
                class="bg-white text-black border border-white rounded-md py-1 px-4 transition-colors hover:bg-black hover:text-white"
            >
                Play
            </A>
        </>
    );
};

export default Home;
