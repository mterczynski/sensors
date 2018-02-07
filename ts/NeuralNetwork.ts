export class NeuralNetwork{
    constructor(){
        this.evaluate([
            200,
            300,
            100,
            7,
            15,
        ]); // test
    }

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

        let hiddenLayerNeuronValues = [0,0,0,0];

        inputs.forEach((input, inputIndex)=>{
            this.inputToHiddenWeights[inputIndex].forEach((synapse, synapseIndex)=>{
                hiddenLayerNeuronValues[synapseIndex] += synapse * input;
            });
        });
        let maxVal = Math.max(...hiddenLayerNeuronValues);

        hiddenLayerNeuronValues = hiddenLayerNeuronValues.map((val)=>{
            return val/maxVal;
        });
        
        let output = 0;
        hiddenLayerNeuronValues.forEach((val, valIndex)=>{
            output += val * this.hiddenToOutputWeights[valIndex];
        });
        output /= this.hiddenLayerSize;
        console.log('output', output);
        return output; // output
    }

    sigmoid(x: number){
        return 1/(1 + Math.pow(Math.E, -x));
    }
}