import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from './icons';

interface PlaybackControlsProps {
    frames: string[];
    isPlaying: boolean;
    togglePlay: () => void;
    fps: number;
    setFps: (fps: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ frames, isPlaying, togglePlay, fps, setFps }) => {
    const [previewFrameIndex, setPreviewFrameIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isPlaying && frames.length > 0) {
            intervalRef.current = window.setInterval(() => {
                setPreviewFrameIndex(prevIndex => (prevIndex + 1) % frames.length);
            }, 1000 / fps);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, fps, frames]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">Preview</h2>
            <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {frames.length > 0 && (
                    <img
                        src={frames[previewFrameIndex]}
                        alt="Animation Preview"
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>
                <div className="flex-grow space-y-1">
                    <label htmlFor="fps-slider" className="text-sm font-medium text-gray-600 flex justify-between">
                        <span>Speed</span>
                        <span>{fps} FPS</span>
                    </label>
                    <input
                        id="fps-slider"
                        type="range"
                        min="1"
                        max="30"
                        value={fps}
                        onChange={(e) => setFps(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default PlaybackControls;