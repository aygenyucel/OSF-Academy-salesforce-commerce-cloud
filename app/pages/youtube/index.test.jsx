import React from "react";
import { renderWithProviders } from './../../utils/test-utils';
import Youtube from './index.jsx';


//check if the youtube component renders correct video URL
test('Youtube component renders with the correct video URL', () => {
    const {getByTestId} = renderWithProviders(<Youtube />)
    const videoPlayer = getByTestId("youtube-video-player")

    expect(videoPlayer).toBeInTheDocument()
    expect(videoPlayer).toHaveAttribute('src', 'https://www.youtube.com/embed/eEzD-Y97ges?si=ji40quQ_tI6w8mJQ')
})

//check if youtube component contains an iframe element

test('Youtube component renders an iframe element', () => {
    const {container} = renderWithProviders(<Youtube />)
    const iframeElement = container.querySelector('iframe')

    expect(iframeElement).toBeInTheDocument()
})