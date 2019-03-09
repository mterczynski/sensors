interface NeuralNetworkOpts{
    weights?: number[]
}

export class NeuralNetwork{

    constructor(opts?: NeuralNetworkOpts){
        if(opts && opts.weights){
            this.weights = opts.weights;
        }  
    }

    readonly inputSize = 5;  
    readonly outputSize = 1;

    // private weights = new Array(5).fill(0).map((el)=>Math.random()*200-100);
    private weights = [
        Math.random()*200-100,
        Math.random()*200-100,
        0,
        Math.random()*200-100,
        Math.random()*200-100
    ]

    getCrossover(neuralNet: NeuralNetwork){
        let combinedWeights = this.weights;
        for(let i=0; i<this.weights.length; i++){
            if(Math.random() > 0.5){
                combinedWeights[i] += neuralNet.weights[i];
                combinedWeights[i] /= 2;
            }

            // mutate:
            if(Math.random()  < 0.01){
                combinedWeights[i] = Math.random()*200-100;
            }
        }

        return new NeuralNetwork({weights: combinedWeights});
    }

    getWeights(){
        return this.weights;
    }
    evaluate(inputs: Array<number>): number{
        if(inputs.length != this.inputSize){
            throw new Error('Expected 5 numerical inputs');
        }
        
        let sum = 0;
        inputs.forEach((input, index)=>{
            sum += input * this.weights[index];
        });

        return sum;
    }
}