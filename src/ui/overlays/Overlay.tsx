import React from 'react';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const greeting = 'Hello Function Component!';

    return <h1>{greeting}</h1>;
}
