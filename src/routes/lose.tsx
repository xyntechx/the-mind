import { Component } from "solid-js";
import { A } from "@solidjs/router";

const Lose: Component = () => {
    return (
        <>
            <p class="text-center">Aw man... Looks like you lost the game.</p>
            <A
                href="/"
                class="bg-white text-black text-center border border-white rounded-md py-1 px-4 mt-4 transition-colors hover:bg-black hover:text-white"
            >
                Try again!
            </A>
        </>
    );
};

export default Lose;
