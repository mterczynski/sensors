export class NeuralNetwork{
    readonly inputSize = 5;
    readonly hiddenLayerSize = 4;    
    readonly outputSize = 1;

    private inputToHiddenWeights = [
        [Math.random(),Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random(),Math.random()],
    ]
    private hiddenToOutputWeights = [
        Math.random(), Math.random(), Math.random(), Math.random()
    ]

    evaluate(inputs: Array<number>){
        if(inputs.length != this.inputSize){
            throw new Error(`Expected ${this.inputSize} inputs`);
        }
    }
}