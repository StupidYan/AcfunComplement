        class EdgeDetector {
            #left=false;
            #right=false;
            #top=false;
            #bottom=false;
            constructor(canvas, directions = [ "top", "bottom", "left", "right" ], reversed = true) {
                this.canvas = canvas;
                this.ctx = canvas.getContext("2d");
                this.width = canvas.width;
                this.height = canvas.height;
                this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
                this.data = this.imageData.data;
                this.grayscaleData = this.rgbaToGrayscale();
                this.setDirections(directions);
                this.threshold = 150;
                this.reverse = reversed;
            }
            rgbaToGrayscale() {
                const grayscaleData = new Uint8ClampedArray(this.width * this.height);
                for (let i = 0; i < this.data.length; i += 4) {
                    const avg = this.data[i] * .3 + this.data[i + 1] * .59 + this.data[i + 2] * .11;
                    grayscaleData[Math.floor(i / 4)] = avg;
                }
                return grayscaleData;
            }
            setDirections(directions) {
                this.#left = this.#right = this.#top = this.#bottom = false;
                directions.forEach((direction => {
                    if (direction === "left") this.#left = true; else if (direction === "right") this.#right = true; else if (direction === "top") this.#top = true; else if (direction === "bottom") this.#bottom = true;
                }));
            }
            detectEdges() {
                const edgeData = new Uint8ClampedArray(this.width * this.height);
                const sobelKernelX = [ [ -1, 0, 1 ], [ -2, 0, 2 ], [ -1, 0, 1 ] ];
                const sobelKernelY = [ [ -1, -2, -1 ], [ 0, 0, 0 ], [ 1, 2, 1 ] ];
                for (let y = 1; y < this.height - 1; y++) {
                    for (let x = 1; x < this.width - 1; x++) {
                        let pixelX = 0, pixelY = 0;
                        for (let row = -1; row <= 1; row++) {
                            for (let col = -1; col <= 1; col++) {
                                const pixel = this.grayscaleData[(y + row) * this.width + (x + col)];
                                pixelX += pixel * sobelKernelX[row + 1][col + 1];
                                pixelY += pixel * sobelKernelY[row + 1][col + 1];
                            }
                        }
                        const index = y * this.width + x;
                        let magnitudeX = Math.abs(pixelX);
                        let magnitudeY = Math.abs(pixelY);
                        if (this.#top && pixelY < 0 && magnitudeY > this.threshold || this.#bottom && pixelY > 0 && magnitudeY > this.threshold || this.#left && pixelX < 0 && magnitudeX > this.threshold || this.#right && pixelX > 0 && magnitudeX > this.threshold) {
                            edgeData[index] = this.reverse ? 255 : 0;
                        }
                    }
                }
                const edgeCanvas = document.createElement("canvas");
                edgeCanvas.width = this.width;
                edgeCanvas.height = this.height;
                const edgeCtx = edgeCanvas.getContext("2d");
                const outputImageData = edgeCtx.createImageData(this.width, this.height);
                for (let i = 0; i < edgeData.length; i++) {
                    outputImageData.data[i * 4] = edgeData[i];
                    outputImageData.data[i * 4 + 1] = edgeData[i];
                    outputImageData.data[i * 4 + 2] = edgeData[i];
                    outputImageData.data[i * 4 + 3] = 255;
                }
                edgeCtx.putImageData(outputImageData, 0, 0);
                return edgeCanvas;
            }
        }
