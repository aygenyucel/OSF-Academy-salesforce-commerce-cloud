import React from "react";

function Youtube() {
    return (
        <>
            <h1>Youtube page</h1>
            <iframe data-testid="youtube-video-player" width="560" height="315" src="https://www.youtube.com/embed/eEzD-Y97ges?si=ji40quQ_tI6w8mJQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </>
    )
}

export default Youtube;