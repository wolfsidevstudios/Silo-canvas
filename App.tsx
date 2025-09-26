
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import FrameStrip from './components/FrameStrip';
import PlaybackControls from './components/PlaybackControls';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;

const App: React.FC = () => {
    const [frames, setFrames] = useState<string[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
    
    const [brushColor, setBrushColor] = useState<string>('#000000');
    const [brushSize, setBrushSize] = useState<number>(5);
    const [isErasing, setIsErasing] = useState<boolean>(false);
    
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [fps, setFps] = useState<number>(12);

    const canvasRef = useRef<{ clear: () => void }>(null);

    useEffect(() => {
        const createBlankFrame = () => {
            const blankCanvas = document.createElement('canvas');
            blankCanvas.width = CANVAS_WIDTH;
            blankCanvas.height = CANVAS_HEIGHT;
            const ctx = blankCanvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            return blankCanvas.toDataURL();
        };
        setFrames([createBlankFrame()]);
    }, []);

    const handleDrawEnd = useCallback((dataUrl: string) => {
        setFrames(prevFrames => {
            const newFrames = [...prevFrames];
            newFrames[currentFrameIndex] = dataUrl;
            return newFrames;
        });
    }, [currentFrameIndex]);

    const handleAddFrame = useCallback(() => {
        const newFrame = frames[currentFrameIndex];
        setFrames(prevFrames => {
            const newFrames = [...prevFrames];
            newFrames.splice(currentFrameIndex + 1, 0, newFrame);
            return newFrames;
        });
        setCurrentFrameIndex(prevIndex => prevIndex + 1);
    }, [currentFrameIndex, frames]);
    
    const handleDuplicateFrame = useCallback(() => {
        const frameToDuplicate = frames[currentFrameIndex];
        setFrames(prevFrames => {
            const newFrames = [...prevFrames];
            newFrames.splice(currentFrameIndex + 1, 0, frameToDuplicate);
            return newFrames;
        });
        setCurrentFrameIndex(prevIndex => prevIndex + 1);
    }, [currentFrameIndex, frames]);

    const handleSelectFrame = useCallback((index: number) => {
        setCurrentFrameIndex(index);
    }, []);

    const handleDeleteFrame = useCallback((index: number) => {
        if (frames.length <= 1) return;
        setFrames(prevFrames => prevFrames.filter((_, i) => i !== index));
        if (currentFrameIndex >= index) {
            setCurrentFrameIndex(prevIndex => Math.max(0, prevIndex - 1));
        }
    }, [frames.length, currentFrameIndex]);

    const handleClearCanvas = useCallback(() => {
        canvasRef.current?.clear();
    }, []);
    
    return (
        <div className="bg-gray-100 min-h-screen w-screen flex flex-col font-sans">
            <header className="w-full flex justify-center p-3 sm:p-4 sticky top-0 bg-gray-100/80 backdrop-blur-sm z-20">
                <Toolbar
                    color={brushColor}
                    setColor={setBrushColor}
                    size={brushSize}
                    setSize={setBrushSize}
                    isErasing={isErasing}
                    setIsErasing={setIsErasing}
                    clearCanvas={handleClearCanvas}
                />
            </header>

            <div className="flex flex-col items-center flex-grow px-4 lg:px-6 pb-4 lg:pb-6">
                <main className="flex flex-col lg:flex-row w-full max-w-7xl flex-grow gap-6">
                    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
                       <h1 className="text-2xl font-bold text-gray-800">Animation Studio</h1>
                       <PlaybackControls
                            frames={frames}
                            isPlaying={isPlaying}
                            togglePlay={() => setIsPlaying(!isPlaying)}
                            fps={fps}
                            setFps={setFps}
                        />
                    </div>
                    
                    <div className="flex-grow flex items-center justify-center bg-white rounded-xl shadow-lg p-2">
                        <Canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            brushColor={brushColor}
                            brushSize={brushSize}
                            isErasing={isErasing}
                            imageToLoad={frames[currentFrameIndex]}
                            onDrawEnd={handleDrawEnd}
                        />
                    </div>
                </main>
                
                <FrameStrip
                    frames={frames}
                    currentFrameIndex={currentFrameIndex}
                    onSelectFrame={handleSelectFrame}
                    onAddFrame={handleAddFrame}
                    onDuplicateFrame={handleDuplicateFrame}
                    onDeleteFrame={handleDeleteFrame}
                />
            </div>
        </div>
    );
};

export default App;
