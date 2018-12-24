import * as React from 'react';
import { Engine } from './Tiles/Engine';
import { Platform } from './Tiles/Platform';
import { Track } from './Tiles/Track';

const tileList = [
    {type: "Track", position: [2, 2]},
    {type: "Track", position: [2, 4]},
    {type: "Track", position: [2, 6]},
    {type: "Track", position: [2, 8]},
    {type: "Track", position: [2, 10]},
    {type: "Track", position: [2, 12]},
    {type: "Track", position: [2, 14]},
    {type: "Track", position: [2, 16]},
    {type: "Track", position: [2, 18]},
    {type: "Track", position: [2, 20]},
    {type: "Platform", position: [1, 2]},
    {type: "Platform", position: [1, 4]},
    {type: "Platform", position: [1, 6]},
    {type: "DieselEngine", position: [2, 6]},
];

export class Land extends React.Component<any, any> {

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    tileList.map((tile: any) => (
                        <>
                            {tile.type === "Track" && <Track top={tile.position[0]*30} left={tile.position[1]*30} />}
                            {tile.type === "Platform" && <Platform top={tile.position[0]*30} left={tile.position[1]*30} />}
                            {tile.type === "DieselEngine" && <Engine top={tile.position[0]*30} left={tile.position[1]*30} />}
                        </>
                    ))
                }
            </div>
        );
    }
}