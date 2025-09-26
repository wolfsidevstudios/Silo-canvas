import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface CanvasProps {
    width: number;
    height: number;
    brushColor: string;
    brushSize: number;
    isErasing: boolean;
    imageToLoad?: string;
    onionSkinImage?: string;
    onDrawEnd: (dataUrl: string) => void;
}

interface CanvasHandle {
    clear: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({
    width,
    height,
    brushColor,
    brushSize,
    isErasing,
    imageToLoad,
    onionSkinImage,
    onDrawEnd,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const onionCanvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        const context = contextRef.current;
        if (!context || !imageToLoad) return;
        const image = new Image();
        image.src = imageToLoad;
        image.onload = () => {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
        };
    }, [imageToLoad, width, height]);

    useEffect(() => {
        const onionCanvas = onionCanvasRef.current;
        if (!onionCanvas) return;
        const onionContext = onionCanvas.getContext('2d');
        if (!onionContext) return;

        onionContext.clearRect(0, 0, width, height);

        if (onionSkinImage) {
            const image = new Image();
            image.src = onionSkinImage;
            image.onload = () => {
                onionContext.drawImage(image, 0, 0, width, height);
            };
        }
    }, [onionSkinImage, width, height]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            if (canvas && context) {
                context.fillStyle = '#FFFFFF';
                context.fillRect(0, 0, canvas.width, canvas.height);
                onDrawEnd(canvas.toDataURL());
            }
        },
    }));

    const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e.nativeEvent) {
            if (e.nativeEvent.touches.length === 0) return null;
            clientX = e.nativeEvent.touches[0].clientX;
            clientY = e.nativeEvent.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        if (rect.width === 0 || rect.height === 0) return null;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const context = contextRef.current;
        if (!context) return;
        const coords = getCoords(e);
        if (!coords) return;

        const { x, y } = coords;
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
        if (canvasRef.current) {
            onDrawEnd(canvasRef.current.toDataURL());
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const context = contextRef.current;
        if (!context) return;

        if ('touches' in e.nativeEvent) {
            e.preventDefault();
        }

        const coords = getCoords(e);
        if (!coords) return;
        const { x, y } = coords;
        
        context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        context.strokeStyle = brushColor;
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        context.lineTo(x, y);
        context.stroke();
    };

    return (
        <div className="relative w-full h-full">
            <canvas
                ref={onionCanvasRef}
                width={width}
                height={height}
                className="absolute top-0 left-0 w-full h-full object-contain opacity-30 pointer-events-none rounded-lg"
            />
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="relative cursor-crosshair bg-transparent rounded-lg w-full h-full object-contain touch-none"
            />
        </div>
    );
});

Canvas.displayName = "Canvas";
export default Canvas;