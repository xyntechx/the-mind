import { Component } from "solid-js";
import { A } from "@solidjs/router";

const NotFound: Component = () => {
    return (
        <>
            <p class="text-center">Oops! This page doesn't exist.</p>
            <A
                href="/"
                class="bg-white text-black text-center border border-white rounded-md py-1 px-4 mt-4 transition-colors hover:bg-black hover:text-white"
            >
                Back to home
            </A>
        </>
    );
};

export default NotFound;
